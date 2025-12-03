'use client';

import { useState, useEffect } from 'react';
import { subscribeToCategories } from '@/lib/firestore-categories-service';
import type { Category } from '@/types';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'breakfast', name: 'Breakfast' },
  { id: 'main-courses', name: 'Main Courses' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'drinks', name: 'Drinks' },
];

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    try {
      const unsubscribe = subscribeToCategories((items) => {
        if (isMounted) {
          setCategories(items.length > 0 ? items : DEFAULT_CATEGORIES);
        }
      });
      return () => {
        isMounted = false;
        unsubscribe();
      };
    } catch (error) {
      console.error('Error subscribing to categories:', error);
    }
  }, []);

  return { categories, loading };
}
