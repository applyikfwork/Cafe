export const tags = ['veg', 'spicy', 'gluten-free', 'new'] as const;
export type Tag = typeof tags[number];

export const spiceLevels = ['mild', 'medium', 'hot', 'extra-hot'] as const;
export type SpiceLevel = typeof spiceLevels[number];

export const dietaryPreferences = ['veg', 'vegan', 'gluten-free', 'dairy-free', 'nut-free'] as const;
export type DietaryPreference = typeof dietaryPreferences[number];

export type SortOption = 'popularity' | 'rating' | 'price-low' | 'price-high' | 'newest';

export interface Review {
  id: string;
  menuItemId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  comment: string;
  date: Date;
  isVerified?: boolean;
  helpful?: number;
  images?: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageId: string;
  imageUrl?: string;
  category: string;
  tags: Tag[];
  ingredients: string[];
  promotionId?: string;
  rating?: number;
  reviewCount?: number;
  prepTime?: number;
  calories?: number;
  orderCount?: number;
  totalBuyers?: number;
  spiceLevel?: SpiceLevel;
  dietary?: DietaryPreference[];
  isPopular?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  reviews?: Review[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  id: string;
  name: string;
}

export interface TodaysSpecial {
  id: string;
  title: string;
  description: string;
  price: number;
  active: boolean;
  updatedAt?: Date;
}

export interface CafeSettings {
  id: string;
  name: string;
  description: string;
  heroImageUrl?: string;
  logoUrl?: string;
  hours: { open: string; close: string };
  address: string;
  phone: string;
  updatedAt?: Date;
}

export type PromotionType = 'percentage' | 'fixed' | 'bogo';

export interface Promotion {
  id: string;
  title: string;
  description: string;
  type: PromotionType;
  value: number;
  code?: string;
  startDate: Date;
  endDate: Date;
  active: boolean;
  applicableItems?: string[];
  minPurchase?: number;
  usageLimit?: number;
  usageCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type GalleryCategory = 'ambiance' | 'food' | 'events' | 'behind-the-scenes';

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: GalleryCategory;
  menuItemId?: string;
  likes: number;
  views?: number;
  isPhotoOfDay?: boolean;
  isContest?: boolean;
  isFeatured?: boolean;
  videoUrl?: string;
  submittedBy?: string;
  submitterEmail?: string;
  tags?: string[];
  order?: number;
  active?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface GalleryVideo {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  videoUrl: string;
  duration?: string;
  category?: GalleryCategory;
  views?: number;
  likes?: number;
  isFeatured?: boolean;
  active?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface PhotoContest {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  active: boolean;
  prize?: string;
  rules?: string[];
  submissions: GalleryItem[];
}

export interface GalleryStats {
  totalPhotos: number;
  totalVideos: number;
  totalLikes: number;
  totalViews: number;
  contestSubmissions: number;
  photosByCategory: Record<GalleryCategory, number>;
}
