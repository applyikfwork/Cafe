'use client';

import { useEffect, useState } from 'react';
import { subscribeToTodaysSpecial, DEFAULT_TODAYS_SPECIAL, type TodaysSpecial } from '@/lib/firestore-todays-special-service';

export function useTodaysSpecial() {
  const [special, setSpecial] = useState<TodaysSpecial>(DEFAULT_TODAYS_SPECIAL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    let unsubscribe: (() => void) | null = null;
    
    try {
      unsubscribe = subscribeToTodaysSpecial((data) => {
        setSpecial(data);
        setLoading(false);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { special, loading, error };
}
