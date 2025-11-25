import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, Timestamp } from 'firebase/firestore';

export interface CafeSettings {
  id: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  hours: {
    open: string;
    close: string;
  };
  socials: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  updatedAt: Timestamp;
}

const SETTINGS_DOC = 'cafe-settings';
export const DEFAULT_SETTINGS: Omit<CafeSettings, 'updatedAt'> = {
  id: SETTINGS_DOC,
  name: 'Cafe Central Station',
  description: 'Where every cup tells a story and every bite feels like home.',
  phone: '(555) 123-4567',
  email: 'hello@cafecentral.station',
  address: '123 Central Street, Food City, FC 12345',
  hours: {
    open: '7:00 AM',
    close: '9:00 PM',
  },
  socials: {
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
  },
};

export async function initializeSettings() {
  try {
    if (!db) {
      console.error('Database not initialized');
      return;
    }
    const settingsRef = doc(db, 'settings', SETTINGS_DOC);
    const settingsSnap = await getDoc(settingsRef);
    
    if (!settingsSnap.exists()) {
      await setDoc(settingsRef, {
        ...DEFAULT_SETTINGS,
        updatedAt: Timestamp.now(),
      });
      console.log('Settings initialized');
    }
  } catch (error) {
    console.error('Error initializing settings:', error);
  }
}

export async function getSettings(): Promise<CafeSettings> {
  try {
    if (!db) {
      console.error('Database not initialized');
      return DEFAULT_SETTINGS as CafeSettings;
    }
    const settingsRef = doc(db, 'settings', SETTINGS_DOC);
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      return settingsSnap.data() as CafeSettings;
    }
    return DEFAULT_SETTINGS as CafeSettings;
  } catch (error) {
    console.error('Error getting settings:', error);
    return DEFAULT_SETTINGS as CafeSettings;
  }
}

export async function updateSettings(updates: Partial<CafeSettings>): Promise<void> {
  try {
    if (!db) {
      throw new Error('Database not initialized. Please configure Firebase credentials.');
    }
    const settingsRef = doc(db, 'settings', SETTINGS_DOC);
    await setDoc(settingsRef, {
      ...updates,
      id: SETTINGS_DOC,
      updatedAt: Timestamp.now(),
    }, { merge: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}

export function subscribeToSettings(callback: (settings: CafeSettings) => void): () => void {
  try {
    if (!db) {
      console.error('Database not initialized');
      callback(DEFAULT_SETTINGS as CafeSettings);
      return () => {};
    }
    const settingsRef = doc(db, 'settings', SETTINGS_DOC);
    const unsubscribe = onSnapshot(
      settingsRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data() as CafeSettings);
        } else {
          callback(DEFAULT_SETTINGS as CafeSettings);
        }
      },
      (error) => {
        console.error('Error subscribing to settings:', error);
        callback(DEFAULT_SETTINGS as CafeSettings);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to settings:', error);
    callback(DEFAULT_SETTINGS as CafeSettings);
    return () => {};
  }
}
