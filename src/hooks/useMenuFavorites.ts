'use client';

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'cafe-central-favorites';
const RECENTLY_VIEWED_KEY = 'cafe-central-recently-viewed';
const MAX_RECENTLY_VIEWED = 10;

export function useMenuFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      const storedRecent = localStorage.getItem(RECENTLY_VIEWED_KEY);
      
      if (storedFavorites) {
        try {
          setFavorites(JSON.parse(storedFavorites));
        } catch (e) {
          console.error('Error parsing favorites:', e);
        }
      }
      
      if (storedRecent) {
        try {
          setRecentlyViewed(JSON.parse(storedRecent));
        } catch (e) {
          console.error('Error parsing recently viewed:', e);
        }
      }
    }
  }, []);

  const toggleFavorite = useCallback((itemId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      }
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((itemId: string) => {
    return favorites.includes(itemId);
  }, [favorites]);

  const addToRecentlyViewed = useCallback((itemId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== itemId);
      const newRecent = [itemId, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(newRecent));
      }
      return newRecent;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(RECENTLY_VIEWED_KEY);
    }
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(FAVORITES_KEY);
    }
  }, []);

  return {
    favorites,
    recentlyViewed,
    toggleFavorite,
    isFavorite,
    addToRecentlyViewed,
    clearRecentlyViewed,
    clearFavorites,
    mounted,
  };
}
