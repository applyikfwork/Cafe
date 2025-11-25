'use client';

import { useEffect, useState } from 'react';
import { subscribeToSettings, getSettings, DEFAULT_SETTINGS } from '@/lib/firestore-settings-service';
import type { CafeSettings } from '@/lib/firestore-settings-service';

export function useSettings() {
  const [settings, setSettings] = useState<CafeSettings>({
    ...DEFAULT_SETTINGS,
    updatedAt: new Date() as any,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    try {
      const unsubscribe = subscribeToSettings((data) => {
        setSettings(data);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
      setLoading(false);
    }
  }, []);

  return { settings, loading, error };
}
