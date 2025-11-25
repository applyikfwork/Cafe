'use client';

import { useEffect, useState } from 'react';
import { subscribeToPromotions, getActivePromotions } from '@/lib/firestore-promotions-service';
import type { Promotion } from '@/types';

function normalizePromotion(promo: any): Promotion {
  return {
    ...promo,
    startDate: promo.startDate instanceof Date ? promo.startDate : 
              promo.startDate?.toDate ? promo.startDate.toDate() : 
              new Date(promo.startDate),
    endDate: promo.endDate instanceof Date ? promo.endDate : 
            promo.endDate?.toDate ? promo.endDate.toDate() : 
            new Date(promo.endDate),
    createdAt: promo.createdAt instanceof Date ? promo.createdAt : 
              promo.createdAt?.toDate ? promo.createdAt.toDate() : 
              new Date(promo.createdAt),
    updatedAt: promo.updatedAt instanceof Date ? promo.updatedAt : 
              promo.updatedAt?.toDate ? promo.updatedAt.toDate() : 
              new Date(promo.updatedAt),
  };
}

export function usePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    try {
      const unsubscribe = subscribeToPromotions((data) => {
        const normalized = data.map(normalizePromotion);
        setPromotions(normalized);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch promotions');
      setLoading(false);
    }
  }, []);

  return { promotions, loading, error };
}

export function useActivePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivePromotions() {
      setLoading(true);
      try {
        const active = await getActivePromotions();
        const normalized = active.map(normalizePromotion);
        setPromotions(normalized);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch active promotions');
        setLoading(false);
      }
    }
    
    fetchActivePromotions();
  }, []);

  return { promotions, loading, error };
}
