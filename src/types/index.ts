export type Tag = 'veg' | 'spicy' | 'gluten-free' | 'new';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageId: string;
  category: string;
  tags: Tag[];
  ingredients: string[];
}

export interface Category {
  id: string;
  name: string;
}
