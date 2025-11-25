'use client';

import { useEffect, useState } from 'react';
import { subscribeToMenuItems, subscribeToMenuItemsByCategory } from '@/lib/firestore-service';
import type { MenuItem } from '@/types';

export function useMenuItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    try {
      const unsubscribe = subscribeToMenuItems((data) => {
        setItems(data);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu items');
      setLoading(false);
    }
  }, []);

  return { items, loading, error };
}

export function useMenuItemsByCategory(category: string) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const unsubscribe = subscribeToMenuItemsByCategory(category, (data) => {
        setItems(data);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu items');
      setLoading(false);
    }
  }, [category]);

  return { items, loading, error };
}
