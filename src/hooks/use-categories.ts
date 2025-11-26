'use client';

import { useState, useEffect } from 'react';
import { subscribeToCategories } from '@/lib/firestore-categories-service';
import type { Category } from '@/types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToCategories((items) => {
      setCategories(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { categories, loading };
}
