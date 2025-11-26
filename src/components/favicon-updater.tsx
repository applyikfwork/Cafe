'use client';

import { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';

export function FaviconUpdater() {
  const { settings } = useSettings();

  useEffect(() => {
    if (settings?.logoUrl && typeof window !== 'undefined') {
      try {
        // Update or create favicon link
        let faviconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement;
        
        if (!faviconLink) {
          faviconLink = document.createElement('link');
          faviconLink.rel = 'icon';
          document.head.appendChild(faviconLink);
        }
        
        faviconLink.href = settings.logoUrl;
        faviconLink.type = 'image/x-icon';
      } catch (error) {
        console.error('Error updating favicon:', error);
      }
    }
  }, [settings?.logoUrl]);

  return null;
}
