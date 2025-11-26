export const tags = ['veg', 'spicy', 'gluten-free', 'new'] as const;
export type Tag = typeof tags[number];

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageId: string;
  category: string;
  tags: Tag[];
  ingredients: string[];
  promotionId?: string;
}

export interface Category {
  id: string;
  name: string;
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
