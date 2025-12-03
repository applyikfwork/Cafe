'use client';

import { useState, useEffect, useCallback } from 'react';
import type { GalleryItem } from '@/types';

const GALLERY_LIKES_KEY = 'cafe-central-gallery-likes';

// Sample gallery data
const sampleGalleryItems: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Morning Coffee Ritual',
    description: 'The perfect start to your day with our signature espresso',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    category: 'food',
    likes: 234,
    isPhotoOfDay: true,
    createdAt: new Date(),
  },
  {
    id: 'g2',
    title: 'Cozy Corner',
    description: 'Our favorite reading spot by the window',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
    category: 'ambiance',
    likes: 189,
    createdAt: new Date(),
  },
  {
    id: 'g3',
    title: 'Fresh Baked Croissants',
    description: 'Straight from the oven every morning',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800',
    category: 'food',
    likes: 312,
    createdAt: new Date(),
  },
  {
    id: 'g4',
    title: 'Live Music Fridays',
    description: 'Jazz nights at the cafe',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    category: 'events',
    likes: 456,
    createdAt: new Date(),
  },
  {
    id: 'g5',
    title: 'Behind the Bar',
    description: 'Our baristas at work',
    imageUrl: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800',
    category: 'behind-the-scenes',
    likes: 145,
    createdAt: new Date(),
  },
  {
    id: 'g6',
    title: 'Avocado Toast Perfection',
    description: 'Our most photographed dish',
    imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800',
    category: 'food',
    likes: 521,
    createdAt: new Date(),
  },
  {
    id: 'g7',
    title: 'Sunset Views',
    description: 'Golden hour at the cafe terrace',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
    category: 'ambiance',
    likes: 398,
    createdAt: new Date(),
  },
  {
    id: 'g8',
    title: 'Art Exhibition Opening',
    description: 'Local artists showcase their work',
    imageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800',
    category: 'events',
    likes: 267,
    createdAt: new Date(),
  },
  {
    id: 'g9',
    title: 'Fresh Ingredients',
    description: 'Farm to table philosophy',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800',
    category: 'behind-the-scenes',
    likes: 178,
    createdAt: new Date(),
  },
  {
    id: 'g10',
    title: 'Signature Latte Art',
    description: 'Every cup is a canvas',
    imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800',
    category: 'food',
    likes: 445,
    createdAt: new Date(),
  },
  {
    id: 'g11',
    title: 'Cozy Interior',
    description: 'Rustic charm meets modern comfort',
    imageUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800',
    category: 'ambiance',
    likes: 334,
    createdAt: new Date(),
  },
  {
    id: 'g12',
    title: 'Book Club Meetup',
    description: 'Monthly literary discussions',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
    category: 'events',
    likes: 156,
    createdAt: new Date(),
  },
];

const sampleVideos = [
  {
    id: 'v1',
    title: 'How We Make Our Signature Latte',
    thumbnail: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '2:45',
  },
  {
    id: 'v2',
    title: 'Fresh Pasta Preparation',
    thumbnail: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '4:12',
  },
  {
    id: 'v3',
    title: 'Morning Baking Routine',
    thumbnail: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '3:30',
  },
];

const sampleContestPhotos: GalleryItem[] = [
  {
    id: 'c1',
    title: 'My Perfect Coffee Moment',
    description: 'Submitted by @coffeelover',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800',
    category: 'food',
    likes: 89,
    isContest: true,
    submittedBy: 'Sarah M.',
    createdAt: new Date(),
  },
  {
    id: 'c2',
    title: 'Rainy Day at Central Station',
    description: 'Submitted by @urbanphotographer',
    imageUrl: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800',
    category: 'ambiance',
    likes: 134,
    isContest: true,
    submittedBy: 'Mike T.',
    createdAt: new Date(),
  },
  {
    id: 'c3',
    title: 'Dessert Heaven',
    description: 'Submitted by @sweettooth',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800',
    category: 'food',
    likes: 201,
    isContest: true,
    submittedBy: 'Emily R.',
    createdAt: new Date(),
  },
];

export function useGallery() {
  const [items, setItems] = useState<GalleryItem[]>(sampleGalleryItems);
  const [contestPhotos, setContestPhotos] = useState<GalleryItem[]>(sampleContestPhotos);
  const [videos] = useState(sampleVideos);
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const storedLikes = localStorage.getItem(GALLERY_LIKES_KEY);
      if (storedLikes) {
        try {
          setLikedItems(JSON.parse(storedLikes));
        } catch (e) {
          console.error('Error parsing gallery likes:', e);
        }
      }
    }
  }, []);

  const toggleLike = useCallback((itemId: string) => {
    setLikedItems(prev => {
      const newLikes = prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(GALLERY_LIKES_KEY, JSON.stringify(newLikes));
      }
      return newLikes;
    });

    // Update like count in items
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const isLiked = likedItems.includes(itemId);
        return { ...item, likes: item.likes + (isLiked ? -1 : 1) };
      }
      return item;
    }));

    setContestPhotos(prev => prev.map(item => {
      if (item.id === itemId) {
        const isLiked = likedItems.includes(itemId);
        return { ...item, likes: item.likes + (isLiked ? -1 : 1) };
      }
      return item;
    }));
  }, [likedItems]);

  const isLiked = useCallback((itemId: string) => {
    return likedItems.includes(itemId);
  }, [likedItems]);

  const getPhotoOfDay = useCallback(() => {
    return items.find(item => item.isPhotoOfDay) || items[0];
  }, [items]);

  const getByCategory = useCallback((category: GalleryItem['category'] | 'all') => {
    if (category === 'all') return items;
    return items.filter(item => item.category === category);
  }, [items]);

  return {
    items,
    contestPhotos,
    videos,
    likedItems,
    toggleLike,
    isLiked,
    getPhotoOfDay,
    getByCategory,
    mounted,
  };
}
