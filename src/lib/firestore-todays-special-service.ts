import { db } from './firebase';
import { doc, getDoc, setDoc, onSnapshot, Timestamp } from 'firebase/firestore';

export interface TodaysSpecial {
  id: string;
  title: string;
  description: string;
  price: number;
  active: boolean;
  updatedAt?: Timestamp | Date;
}

const TODAYS_SPECIAL_DOC = 'todays-special';

export const DEFAULT_TODAYS_SPECIAL: TodaysSpecial = {
  id: TODAYS_SPECIAL_DOC,
  title: 'Pumpkin Spice Latte + Cinnamon Roll Combo',
  description: 'Seasonal favorite with fresh pastry',
  price: 8.99,
  active: true,
};

export async function initializeTodaysSpecial() {
  try {
    if (!db) {
      console.log('Database not initialized');
      return;
    }
    const specialRef = doc(db, 'settings', TODAYS_SPECIAL_DOC);
    const specialSnap = await getDoc(specialRef);
    
    if (!specialSnap.exists()) {
      await setDoc(specialRef, {
        ...DEFAULT_TODAYS_SPECIAL,
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error initializing todays special:', error);
  }
}

export async function getTodaysSpecial(): Promise<TodaysSpecial> {
  try {
    if (!db) {
      console.log('Database not initialized');
      return DEFAULT_TODAYS_SPECIAL;
    }
    const specialRef = doc(db, 'settings', TODAYS_SPECIAL_DOC);
    const specialSnap = await getDoc(specialRef);
    
    if (specialSnap.exists()) {
      const data = specialSnap.data();
      return {
        ...data,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      } as TodaysSpecial;
    }
    return DEFAULT_TODAYS_SPECIAL;
  } catch (error) {
    console.error('Error fetching todays special:', error);
    return DEFAULT_TODAYS_SPECIAL;
  }
}

export async function updateTodaysSpecial(special: Partial<TodaysSpecial>): Promise<void> {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }
    const specialRef = doc(db, 'settings', TODAYS_SPECIAL_DOC);
    
    const updateData: any = {
      ...special,
      updatedAt: Timestamp.now(),
    };
    
    await setDoc(specialRef, updateData, { merge: true });
  } catch (error) {
    console.error('Error updating todays special:', error);
    throw error;
  }
}

export function subscribeToTodaysSpecial(callback: (special: TodaysSpecial) => void): () => void {
  try {
    if (!db) {
      console.log('Database not initialized');
      callback(DEFAULT_TODAYS_SPECIAL);
      return () => {};
    }
    
    const specialRef = doc(db, 'settings', TODAYS_SPECIAL_DOC);
    
    const unsubscribe = onSnapshot(
      specialRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          callback({
            ...data,
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
          } as TodaysSpecial);
        } else {
          callback(DEFAULT_TODAYS_SPECIAL);
        }
      },
      (error) => {
        console.error('Error subscribing to todays special:', error);
        callback(DEFAULT_TODAYS_SPECIAL);
      }
    );
    
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to todays special:', error);
    callback(DEFAULT_TODAYS_SPECIAL);
    return () => {};
  }
}
