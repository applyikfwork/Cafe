'use client';

import { useState, useEffect, useCallback } from 'react';
import type { GalleryItem, GalleryVideo } from '@/types';
import {
  subscribeToGalleryItems,
  subscribeToGalleryVideos,
  subscribeToContestPhotos,
  getPhotoOfDay as fetchPhotoOfDay,
  incrementLikes,
  incrementViews,
} from '@/lib/firestore-gallery-service';

const GALLERY_LIKES_KEY = 'cafe-central-gallery-likes';

export function useGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [contestPhotos, setContestPhotos] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [photoOfDay, setPhotoOfDay] = useState<GalleryItem | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const storedLikes = localStorage.getItem(GALLERY_LIKES_KEY);
      if (storedLikes) {
        try {
          setLikedItems(JSON.parse(storedLikes));
        } catch (e) {
          console.error('Error parsing gallery likes:', e);
        }
      }
    }

    const unsubItems = subscribeToGalleryItems((data) => {
      const regularItems = data.filter(item => !item.isContest);
      setItems(regularItems);
      setLoading(false);
    });

    const unsubContest = subscribeToContestPhotos((data) => {
      setContestPhotos(data);
    });

    const unsubVideos = subscribeToGalleryVideos((data) => {
      setVideos(data);
    });

    fetchPhotoOfDay().then(setPhotoOfDay);

    return () => {
      unsubItems();
      unsubContest();
      unsubVideos();
    };
  }, []);

  const toggleLike = useCallback((itemId: string) => {
    const wasLiked = likedItems.includes(itemId);
    
    setLikedItems(prev => {
      const newLikes = wasLiked
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(GALLERY_LIKES_KEY, JSON.stringify(newLikes));
      }
      return newLikes;
    });

    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, likes: item.likes + (wasLiked ? -1 : 1) };
      }
      return item;
    }));

    setContestPhotos(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, likes: item.likes + (wasLiked ? -1 : 1) };
      }
      return item;
    }));

    if (!wasLiked) {
      incrementLikes(itemId);
    }
  }, [likedItems]);

  const isLiked = useCallback((itemId: string) => {
    return likedItems.includes(itemId);
  }, [likedItems]);

  const getPhotoOfDay = useCallback(() => {
    if (photoOfDay) return photoOfDay;
    return items.find(item => item.isPhotoOfDay) || items[0];
  }, [items, photoOfDay]);

  const getByCategory = useCallback((category: GalleryItem['category'] | 'all') => {
    if (category === 'all') return items.filter(item => item.active !== false);
    return items.filter(item => item.category === category && item.active !== false);
  }, [items]);

  const recordView = useCallback((itemId: string) => {
    incrementViews(itemId);
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, views: (item.views || 0) + 1 };
      }
      return item;
    }));
  }, []);

  return {
    items,
    contestPhotos,
    videos,
    likedItems,
    toggleLike,
    isLiked,
    getPhotoOfDay,
    getByCategory,
    recordView,
    mounted,
    loading,
  };
}
