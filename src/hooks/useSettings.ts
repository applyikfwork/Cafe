'use client';

import { useEffect, useState } from 'react';
import { subscribeToSettings, DEFAULT_SETTINGS, type CafeSettings } from '@/lib/firestore-settings-service';

const initialSettings: CafeSettings = {
  ...DEFAULT_SETTINGS,
  updatedAt: new Date() as any, // This is a placeholder
};

export function useSettings() {
  const [settings, setSettings] = useState<CafeSettings>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    let unsubscribe: (() => void) | null = null;
    
    try {
      unsubscribe = subscribeToSettings((data) => {
        setSettings(data);
        setLoading(false);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { settings, loading, error };
}
