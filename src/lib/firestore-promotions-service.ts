import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import type { Promotion } from '@/types';

export async function getPromotions(): Promise<Promotion[]> {
  try {
    if (!db) {
      console.log('Database not initialized, returning empty promotions list');
      return [];
    }
    const promotionsCollection = collection(db, 'promotions');
    const promotionsQuery = query(promotionsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(promotionsQuery);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      startDate: doc.data().startDate?.toDate(),
      endDate: doc.data().endDate?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Promotion));
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return [];
  }
}

export async function getActivePromotions(): Promise<Promotion[]> {
  try {
    if (!db) {
      console.log('Database not initialized, returning empty active promotions list');
      return [];
    }
    const promotionsCollection = collection(db, 'promotions');
    const now = Timestamp.now();
    const activeQuery = query(
      promotionsCollection,
      where('active', '==', true),
      where('endDate', '>=', now)
    );
    const snapshot = await getDocs(activeQuery);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      startDate: doc.data().startDate?.toDate(),
      endDate: doc.data().endDate?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Promotion));
  } catch (error) {
    console.error('Error fetching active promotions:', error);
    return [];
  }
}

export async function getPromotion(id: string): Promise<Promotion | null> {
  try {
    if (!db) {
      console.log('Database not initialized');
      return null;
    }
    const promotionRef = doc(db, 'promotions', id);
    const promotionSnap = await getDoc(promotionRef);
    
    if (promotionSnap.exists()) {
      const data = promotionSnap.data();
      return {
        ...data,
        id: promotionSnap.id,
        startDate: data.startDate?.toDate(),
        endDate: data.endDate?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Promotion;
    }
    return null;
  } catch (error) {
    console.error('Error fetching promotion:', error);
    return null;
  }
}

export async function createPromotion(promotion: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    if (!db) {
      throw new Error('Database not initialized. Please configure Firebase credentials in Replit Secrets.');
    }
    
    if (!promotion.title || !promotion.type || promotion.value === undefined) {
      throw new Error('Title, type, and value are required');
    }
    
    if (promotion.startDate >= promotion.endDate) {
      throw new Error('End date must be after start date');
    }
    
    if (promotion.type === 'percentage' && (promotion.value < 0 || promotion.value > 100)) {
      throw new Error('Percentage value must be between 0 and 100');
    }
    
    if (promotion.type === 'fixed' && promotion.value < 0) {
      throw new Error('Fixed value must be positive');
    }
    
    const promotionsCollection = collection(db, 'promotions');
    const newPromotionRef = doc(promotionsCollection);
    
    const dataToSave: any = {
      title: promotion.title,
      description: promotion.description,
      type: promotion.type,
      value: promotion.value,
      active: promotion.active,
      startDate: Timestamp.fromDate(promotion.startDate),
      endDate: Timestamp.fromDate(promotion.endDate),
      usageCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    if (promotion.code) dataToSave.code = promotion.code;
    if (promotion.minPurchase !== undefined && promotion.minPurchase > 0) dataToSave.minPurchase = promotion.minPurchase;
    if (promotion.usageLimit !== undefined && promotion.usageLimit > 0) dataToSave.usageLimit = promotion.usageLimit;
    if (promotion.applicableItems && promotion.applicableItems.length > 0) dataToSave.applicableItems = promotion.applicableItems;
    
    await setDoc(newPromotionRef, dataToSave);
    
    return newPromotionRef.id;
  } catch (error) {
    console.error('Error creating promotion:', error);
    throw error;
  }
}

export async function updatePromotion(id: string, updates: Partial<Promotion>): Promise<void> {
  try {
    if (!db) {
      throw new Error('Database not initialized. Please configure Firebase credentials in Replit Secrets.');
    }
    
    const promotionRef = doc(db, 'promotions', id);
    const existingPromo = await getDoc(promotionRef);
    
    if (!existingPromo.exists()) {
      throw new Error('Promotion not found');
    }
    
    const current = existingPromo.data();
    const finalType = updates.type || current.type;
    const finalValue = updates.value !== undefined ? updates.value : current.value;
    
    if (!finalType || typeof finalValue !== 'number') {
      throw new Error('Type and numeric value are required and cannot be removed');
    }
    
    const currentStartDate = current.startDate instanceof Timestamp ? current.startDate.toDate() : 
                            current.startDate ? new Date(current.startDate) : null;
    const currentEndDate = current.endDate instanceof Timestamp ? current.endDate.toDate() : 
                          current.endDate ? new Date(current.endDate) : null;
    
    const finalStartDate = updates.startDate || currentStartDate;
    const finalEndDate = updates.endDate || currentEndDate;
    
    if (finalStartDate && finalEndDate && finalStartDate >= finalEndDate) {
      throw new Error('End date must be after start date');
    }
    
    if (finalType === 'percentage' && (finalValue < 0 || finalValue > 100)) {
      throw new Error('Percentage value must be between 0 and 100');
    }
    
    if (finalType === 'fixed' && finalValue < 0) {
      throw new Error('Fixed value must be positive');
    }
    
    const updateData: any = {
      updatedAt: Timestamp.now(),
    };
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.value !== undefined) updateData.value = updates.value;
    if (updates.active !== undefined) updateData.active = updates.active;
    if (updates.code !== undefined) updateData.code = updates.code;
    if (updates.minPurchase !== undefined) {
      if (updates.minPurchase > 0) updateData.minPurchase = updates.minPurchase;
    }
    if (updates.usageLimit !== undefined) {
      if (updates.usageLimit > 0) updateData.usageLimit = updates.usageLimit;
    }
    if (updates.applicableItems !== undefined) updateData.applicableItems = updates.applicableItems;
    if (updates.startDate) {
      updateData.startDate = Timestamp.fromDate(updates.startDate);
    }
    if (updates.endDate) {
      updateData.endDate = Timestamp.fromDate(updates.endDate);
    }
    
    await updateDoc(promotionRef, updateData);
  } catch (error) {
    console.error('Error updating promotion:', error);
    throw error;
  }
}

export async function deletePromotion(id: string): Promise<void> {
  try {
    if (!db) {
      throw new Error('Database not initialized. Please configure Firebase credentials in Replit Secrets.');
    }
    const promotionRef = doc(db, 'promotions', id);
    await deleteDoc(promotionRef);
  } catch (error) {
    console.error('Error deleting promotion:', error);
    throw error;
  }
}

export function subscribeToPromotions(callback: (promotions: Promotion[]) => void): () => void {
  try {
    if (!db) {
      console.log('Database not initialized, returning empty promotions list');
      callback([]);
      return () => {};
    }
    
    const promotionsCollection = collection(db, 'promotions');
    const promotionsQuery = query(promotionsCollection, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(
      promotionsQuery,
      (snapshot) => {
        const promotions = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          startDate: doc.data().startDate?.toDate(),
          endDate: doc.data().endDate?.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        } as Promotion));
        callback(promotions);
      },
      (error) => {
        console.error('Error subscribing to promotions:', error);
        callback([]);
      }
    );
    
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to promotions:', error);
    callback([]);
    return () => {};
  }
}

export async function incrementPromotionUsage(id: string): Promise<void> {
  try {
    if (!db) {
      throw new Error('Database not initialized. Please configure Firebase credentials in Replit Secrets.');
    }
    const promotionRef = doc(db, 'promotions', id);
    const promotionSnap = await getDoc(promotionRef);
    
    if (promotionSnap.exists()) {
      const currentCount = promotionSnap.data().usageCount || 0;
      await updateDoc(promotionRef, {
        usageCount: currentCount + 1,
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error incrementing promotion usage:', error);
    throw error;
  }
}
