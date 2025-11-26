'use client';

import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const MAX_FILE_SIZE = 900 * 1024;
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const INITIAL_QUALITY = 0.8;

export async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        try {
          const blob = await compressWithCanvas(img, file.type);
          resolve(blob);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

async function compressWithCanvas(img: HTMLImageElement, mimeType: string): Promise<Blob> {
  let { width, height } = img;
  
  if (width > MAX_WIDTH || height > MAX_HEIGHT) {
    const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  const outputType = mimeType === 'image/png' ? 'image/jpeg' : mimeType;
  let quality = INITIAL_QUALITY;
  let blob: Blob | null = null;

  while (quality > 0.1) {
    blob = await canvasToBlob(canvas, outputType, quality);
    if (blob.size <= MAX_FILE_SIZE) {
      return blob;
    }
    quality -= 0.1;
  }

  const smallerWidth = Math.round(width * 0.7);
  const smallerHeight = Math.round(height * 0.7);
  canvas.width = smallerWidth;
  canvas.height = smallerHeight;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, smallerWidth, smallerHeight);
  ctx.drawImage(img, 0, 0, smallerWidth, smallerHeight);
  
  blob = await canvasToBlob(canvas, 'image/jpeg', 0.6);
  
  if (blob.size > MAX_FILE_SIZE) {
    throw new Error('Unable to compress image below 1MB. Please use a smaller image.');
  }
  
  return blob;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      },
      type,
      quality
    );
  });
}

export async function uploadMenuImage(file: File, itemId: string): Promise<string> {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized. Please configure Firebase.');
  }

  let imageBlob: Blob;
  
  try {
    if (file.size > MAX_FILE_SIZE) {
      imageBlob = await compressImage(file);
    } else {
      imageBlob = file;
    }
  } catch (compressionError) {
    console.error('Image compression failed:', compressionError);
    imageBlob = file;
  }

  const timestamp = Date.now();
  const extension = file.type === 'image/png' ? 'jpg' : file.name.split('.').pop() || 'jpg';
  const fileName = `menu-images/${itemId}_${timestamp}.${extension}`;
  
  try {
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, imageBlob);
    
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (uploadError) {
    console.error('Firebase upload error:', uploadError);
    throw new Error('Failed to upload image to storage. Please try again.');
  }
}

export async function deleteMenuImage(imageUrl: string): Promise<void> {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized.');
  }

  try {
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}
