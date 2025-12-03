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
  orderBy,
  onSnapshot,
  Timestamp,
  limit,
} from 'firebase/firestore';
import type { GalleryItem, GalleryVideo, GalleryCategory, GalleryStats } from '@/types';

const MOCK_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Morning Coffee Ritual',
    description: 'The perfect start to your day with our signature espresso',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    category: 'food',
    likes: 234,
    views: 1520,
    isPhotoOfDay: true,
    active: true,
    createdAt: new Date(),
  },
  {
    id: 'g2',
    title: 'Cozy Corner',
    description: 'Our favorite reading spot by the window',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
    category: 'ambiance',
    likes: 189,
    views: 890,
    active: true,
    createdAt: new Date(),
  },
  {
    id: 'g3',
    title: 'Fresh Baked Croissants',
    description: 'Straight from the oven every morning',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800',
    category: 'food',
    likes: 312,
    views: 2100,
    isFeatured: true,
    active: true,
    createdAt: new Date(),
  },
  {
    id: 'g4',
    title: 'Live Music Fridays',
    description: 'Jazz nights at the cafe',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    category: 'events',
    likes: 456,
    views: 3200,
    active: true,
    createdAt: new Date(),
  },
  {
    id: 'g5',
    title: 'Behind the Bar',
    description: 'Our baristas at work',
    imageUrl: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800',
    category: 'behind-the-scenes',
    likes: 145,
    views: 780,
    active: true,
    createdAt: new Date(),
  },
  {
    id: 'g6',
    title: 'Avocado Toast Perfection',
    description: 'Our most photographed dish',
    imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800',
    category: 'food',
    likes: 521,
    views: 4500,
    isFeatured: true,
    active: true,
    createdAt: new Date(),
  },
  {
    id: 'g7',
    title: 'Sunset Views',
    description: 'Golden hour at the cafe terrace',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
    category: 'ambiance',
    likes: 398,
    views: 2800,
    active: true,
    createdAt: new Date(),
  },
  {
    id: 'g8',
    title: 'Art Exhibition Opening',
    description: 'Local artists showcase their work',
    imageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800',
    category: 'events',
    likes: 267,
    views: 1900,
    active: true,
    createdAt: new Date(),
  },
];

const MOCK_VIDEOS: GalleryVideo[] = [
  {
    id: 'v1',
    title: 'How We Make Our Signature Latte',
    description: 'Watch our baristas craft the perfect latte',
    thumbnail: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '2:45',
    category: 'behind-the-scenes',
    views: 5400,
    likes: 234,
    isFeatured: true,
    active: true,
    createdAt: new Date(),
  },
  {
    id: 'v2',
    title: 'Fresh Pasta Preparation',
    description: 'From scratch to plate',
    thumbnail: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '4:12',
    category: 'food',
    views: 3200,
    likes: 189,
    active: true,
    createdAt: new Date(),
  },
  {
    id: 'v3',
    title: 'Morning Baking Routine',
    description: 'Early morning in our kitchen',
    thumbnail: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '3:30',
    category: 'behind-the-scenes',
    views: 2800,
    likes: 156,
    active: true,
    createdAt: new Date(),
  },
];

const MOCK_CONTEST_PHOTOS: GalleryItem[] = [
  {
    id: 'c1',
    title: 'My Perfect Coffee Moment',
    description: 'Submitted by @coffeelover',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800',
    category: 'food',
    likes: 89,
    views: 450,
    isContest: true,
    submittedBy: 'Sarah M.',
    submitterEmail: 'sarah@example.com',
    active: true,
    createdAt: new Date(),
  },
  {
    id: 'c2',
    title: 'Rainy Day at Central Station',
    description: 'Submitted by @urbanphotographer',
    imageUrl: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800',
    category: 'ambiance',
    likes: 134,
    views: 680,
    isContest: true,
    submittedBy: 'Mike T.',
    submitterEmail: 'mike@example.com',
    active: true,
    createdAt: new Date(),
  },
  {
    id: 'c3',
    title: 'Dessert Heaven',
    description: 'Submitted by @sweettooth',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800',
    category: 'food',
    likes: 201,
    views: 920,
    isContest: true,
    submittedBy: 'Emily R.',
    submitterEmail: 'emily@example.com',
    active: true,
    createdAt: new Date(),
  },
];

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    if (!db) {
      return MOCK_GALLERY_ITEMS;
    }
    const querySnapshot = await getDocs(
      query(collection(db, 'gallery'), where('isContest', '!=', true), orderBy('isContest'), orderBy('createdAt', 'desc'))
    );
    const items = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.(),
    } as GalleryItem));
    return items.length > 0 ? items : MOCK_GALLERY_ITEMS;
  } catch (error) {
    console.error('Error getting gallery items:', error);
    return MOCK_GALLERY_ITEMS;
  }
}

export async function getGalleryItemsByCategory(category: GalleryCategory): Promise<GalleryItem[]> {
  try {
    if (!db) {
      return MOCK_GALLERY_ITEMS.filter((item) => item.category === category);
    }
    const q = query(
      collection(db, 'gallery'),
      where('category', '==', category),
      where('active', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    } as GalleryItem));
    return items.length > 0 ? items : MOCK_GALLERY_ITEMS.filter((item) => item.category === category);
  } catch (error) {
    console.error('Error getting gallery items by category:', error);
    return MOCK_GALLERY_ITEMS.filter((item) => item.category === category);
  }
}

export async function getContestPhotos(): Promise<GalleryItem[]> {
  try {
    if (!db) {
      return MOCK_CONTEST_PHOTOS;
    }
    const q = query(
      collection(db, 'gallery'),
      where('isContest', '==', true),
      where('active', '==', true),
      orderBy('likes', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    } as GalleryItem));
    return items.length > 0 ? items : MOCK_CONTEST_PHOTOS;
  } catch (error) {
    console.error('Error getting contest photos:', error);
    return MOCK_CONTEST_PHOTOS;
  }
}

export async function getGalleryVideos(): Promise<GalleryVideo[]> {
  try {
    if (!db) {
      return MOCK_VIDEOS;
    }
    const q = query(
      collection(db, 'gallery-videos'),
      where('active', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    } as GalleryVideo));
    return items.length > 0 ? items : MOCK_VIDEOS;
  } catch (error) {
    console.error('Error getting gallery videos:', error);
    return MOCK_VIDEOS;
  }
}

export async function getPhotoOfDay(): Promise<GalleryItem | null> {
  try {
    if (!db) {
      return MOCK_GALLERY_ITEMS.find((item) => item.isPhotoOfDay) || MOCK_GALLERY_ITEMS[0];
    }
    const q = query(
      collection(db, 'gallery'),
      where('isPhotoOfDay', '==', true),
      where('active', '==', true),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      } as GalleryItem;
    }
    return MOCK_GALLERY_ITEMS.find((item) => item.isPhotoOfDay) || MOCK_GALLERY_ITEMS[0];
  } catch (error) {
    console.error('Error getting photo of day:', error);
    return MOCK_GALLERY_ITEMS.find((item) => item.isPhotoOfDay) || MOCK_GALLERY_ITEMS[0];
  }
}

export async function addGalleryItem(item: Omit<GalleryItem, 'id'>): Promise<string> {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }
    const newId = `gallery-${Date.now()}`;
    await setDoc(doc(db, 'gallery', newId), {
      ...item,
      likes: item.likes || 0,
      views: item.views || 0,
      active: item.active !== false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return newId;
  } catch (error) {
    console.error('Error adding gallery item:', error);
    throw error;
  }
}

export async function updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<void> {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }
    await updateDoc(doc(db, 'gallery', id), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    throw error;
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }
    await deleteDoc(doc(db, 'gallery', id));
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    throw error;
  }
}

export async function setPhotoOfDay(id: string): Promise<void> {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }
    const currentPotdQuery = query(
      collection(db, 'gallery'),
      where('isPhotoOfDay', '==', true)
    );
    const currentPotdSnapshot = await getDocs(currentPotdQuery);
    for (const docSnap of currentPotdSnapshot.docs) {
      await updateDoc(doc(db, 'gallery', docSnap.id), { isPhotoOfDay: false });
    }
    await updateDoc(doc(db, 'gallery', id), {
      isPhotoOfDay: true,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error setting photo of day:', error);
    throw error;
  }
}

export async function incrementLikes(id: string): Promise<void> {
  try {
    if (!db) return;
    const docRef = doc(db, 'gallery', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentLikes = docSnap.data().likes || 0;
      await updateDoc(docRef, { likes: currentLikes + 1 });
    }
  } catch (error) {
    console.error('Error incrementing likes:', error);
  }
}

export async function incrementViews(id: string): Promise<void> {
  try {
    if (!db) return;
    const docRef = doc(db, 'gallery', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentViews = docSnap.data().views || 0;
      await updateDoc(docRef, { views: currentViews + 1 });
    }
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

export async function addGalleryVideo(video: Omit<GalleryVideo, 'id'>): Promise<string> {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }
    const newId = `video-${Date.now()}`;
    await setDoc(doc(db, 'gallery-videos', newId), {
      ...video,
      views: video.views || 0,
      likes: video.likes || 0,
      active: video.active !== false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return newId;
  } catch (error) {
    console.error('Error adding gallery video:', error);
    throw error;
  }
}

export async function updateGalleryVideo(id: string, updates: Partial<GalleryVideo>): Promise<void> {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }
    await updateDoc(doc(db, 'gallery-videos', id), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating gallery video:', error);
    throw error;
  }
}

export async function deleteGalleryVideo(id: string): Promise<void> {
  try {
    if (!db) {
      throw new Error('Database not initialized');
    }
    await deleteDoc(doc(db, 'gallery-videos', id));
  } catch (error) {
    console.error('Error deleting gallery video:', error);
    throw error;
  }
}

export function subscribeToGalleryItems(callback: (items: GalleryItem[]) => void): () => void {
  try {
    if (!db) {
      callback(MOCK_GALLERY_ITEMS);
      return () => {};
    }
    const q = query(
      collection(db, 'gallery'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate?.(),
        } as GalleryItem));
        callback(items.length > 0 ? items : MOCK_GALLERY_ITEMS);
      },
      (error) => {
        console.error('Error subscribing to gallery items:', error);
        callback(MOCK_GALLERY_ITEMS);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to gallery items:', error);
    callback(MOCK_GALLERY_ITEMS);
    return () => {};
  }
}

export function subscribeToGalleryVideos(callback: (videos: GalleryVideo[]) => void): () => void {
  try {
    if (!db) {
      callback(MOCK_VIDEOS);
      return () => {};
    }
    const q = query(
      collection(db, 'gallery-videos'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const videos = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        } as GalleryVideo));
        callback(videos.length > 0 ? videos : MOCK_VIDEOS);
      },
      (error) => {
        console.error('Error subscribing to gallery videos:', error);
        callback(MOCK_VIDEOS);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to gallery videos:', error);
    callback(MOCK_VIDEOS);
    return () => {};
  }
}

export function subscribeToContestPhotos(callback: (items: GalleryItem[]) => void): () => void {
  try {
    if (!db) {
      callback(MOCK_CONTEST_PHOTOS);
      return () => {};
    }
    const q = query(
      collection(db, 'gallery'),
      where('isContest', '==', true),
      orderBy('likes', 'desc')
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        } as GalleryItem));
        callback(items.length > 0 ? items : MOCK_CONTEST_PHOTOS);
      },
      (error) => {
        console.error('Error subscribing to contest photos:', error);
        callback(MOCK_CONTEST_PHOTOS);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to contest photos:', error);
    callback(MOCK_CONTEST_PHOTOS);
    return () => {};
  }
}

export async function getGalleryStats(): Promise<GalleryStats> {
  try {
    const items = await getGalleryItems();
    const contestPhotos = await getContestPhotos();
    const videos = await getGalleryVideos();
    
    const photosByCategory: Record<GalleryCategory, number> = {
      'ambiance': 0,
      'food': 0,
      'events': 0,
      'behind-the-scenes': 0,
    };
    
    items.forEach(item => {
      photosByCategory[item.category]++;
    });
    
    return {
      totalPhotos: items.length,
      totalVideos: videos.length,
      totalLikes: items.reduce((sum, item) => sum + (item.likes || 0), 0) + 
                  videos.reduce((sum, video) => sum + (video.likes || 0), 0),
      totalViews: items.reduce((sum, item) => sum + (item.views || 0), 0) +
                  videos.reduce((sum, video) => sum + (video.views || 0), 0),
      contestSubmissions: contestPhotos.length,
      photosByCategory,
    };
  } catch (error) {
    console.error('Error getting gallery stats:', error);
    return {
      totalPhotos: MOCK_GALLERY_ITEMS.length,
      totalVideos: MOCK_VIDEOS.length,
      totalLikes: 0,
      totalViews: 0,
      contestSubmissions: MOCK_CONTEST_PHOTOS.length,
      photosByCategory: {
        'ambiance': 0,
        'food': 0,
        'events': 0,
        'behind-the-scenes': 0,
      },
    };
  }
}

export { MOCK_GALLERY_ITEMS, MOCK_VIDEOS, MOCK_CONTEST_PHOTOS };
