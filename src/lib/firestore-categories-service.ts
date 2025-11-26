import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import type { Category } from '@/types';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'breakfast', name: 'Breakfast' },
  { id: 'main-courses', name: 'Main Courses' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'drinks', name: 'Drinks' },
];

export async function initializeCategories(): Promise<void> {
  try {
    if (!db) {
      console.log('Database not initialized, skipping category initialization');
      return;
    }
    const categoriesCollection = collection(db, 'categories');
    const existingDocs = await getDocs(categoriesCollection);
    
    if (existingDocs.empty) {
      for (const category of DEFAULT_CATEGORIES) {
        await setDoc(doc(categoriesCollection, category.id), {
          ...category,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }
      console.log('Default categories initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing categories:', error);
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    if (!db) {
      console.log('Database not initialized, returning default categories');
      return DEFAULT_CATEGORIES;
    }
    const categoriesCollection = collection(db, 'categories');
    const q = query(categoriesCollection, orderBy('name'));
    const querySnapshot = await getDocs(q);
    const categories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    } as Category));
    
    return categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  } catch (error) {
    console.error('Error getting categories:', error);
    return DEFAULT_CATEGORIES;
  }
}

export async function getCategory(id: string): Promise<Category | null> {
  try {
    if (!db) {
      return DEFAULT_CATEGORIES.find((c) => c.id === id) || null;
    }
    const docSnap = await getDoc(doc(db, 'categories', id));
    if (docSnap.exists()) {
      return { id: docSnap.id, name: docSnap.data().name } as Category;
    }
    return DEFAULT_CATEGORIES.find((c) => c.id === id) || null;
  } catch (error) {
    console.error('Error getting category:', error);
    return null;
  }
}

export async function addCategory(category: Omit<Category, 'id'> & { id?: string }): Promise<string> {
  try {
    if (!db) {
      throw new Error('Database not initialized. Please configure Firebase credentials.');
    }
    const categoryId = category.id || `category-${Date.now()}`;
    await setDoc(doc(db, 'categories', categoryId), {
      name: category.name,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return categoryId;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<void> {
  try {
    if (!db) {
      throw new Error('Database not initialized. Please configure Firebase credentials.');
    }
    await updateDoc(doc(db, 'categories', id), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    if (!db) {
      throw new Error('Database not initialized. Please configure Firebase credentials.');
    }
    await deleteDoc(doc(db, 'categories', id));
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

export function subscribeToCategories(callback: (categories: Category[]) => void): () => void {
  try {
    if (!db) {
      console.log('Database not initialized, using default categories');
      callback(DEFAULT_CATEGORIES);
      return () => {};
    }
    const categoriesCollection = collection(db, 'categories');
    const q = query(categoriesCollection, orderBy('name'));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const categories = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        } as Category));
        callback(categories.length > 0 ? categories : DEFAULT_CATEGORIES);
      },
      (error) => {
        console.error('Error subscribing to categories:', error);
        callback(DEFAULT_CATEGORIES);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to categories:', error);
    callback(DEFAULT_CATEGORIES);
    return () => {};
  }
}
