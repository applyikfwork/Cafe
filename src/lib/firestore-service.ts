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
} from 'firebase/firestore';
import type { MenuItem } from '@/types';

// Mock data for initialization
const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    name: 'Classic Avocado Toast',
    description: 'Thick-cut sourdough topped with fresh avocado, chili flakes, and a squeeze of lime.',
    price: 12.50,
    imageId: 'avocado-toast',
    category: 'breakfast',
    tags: ['veg', 'new'],
    ingredients: ['Sourdough Bread', 'Avocado', 'Chili Flakes', 'Lime', 'Salt', 'Pepper'],
  },
  {
    id: 'item-2',
    name: 'Artisan Latte',
    description: 'Perfectly balanced espresso with steamed milk, topped with beautiful latte art.',
    price: 5.00,
    imageId: 'coffee-art',
    category: 'drinks',
    tags: ['veg'],
    ingredients: ['Espresso', 'Milk'],
  },
  {
    id: 'item-3',
    name: 'Almond Croissant',
    description: 'A flaky, buttery croissant filled with sweet almond paste and topped with toasted almonds.',
    price: 6.50,
    imageId: 'croissant',
    category: 'breakfast',
    tags: ['veg'],
    ingredients: ['Flour', 'Butter', 'Sugar', 'Almonds', 'Yeast'],
  },
  {
    id: 'item-4',
    name: 'Berry Cheesecake',
    description: 'Creamy New York style cheesecake with a graham cracker crust and a tart berry compote.',
    price: 8.00,
    imageId: 'cheesecake',
    category: 'desserts',
    tags: ['veg'],
    ingredients: ['Cream Cheese', 'Sugar', 'Eggs', 'Berries', 'Graham Cracker'],
  },
  {
    id: 'item-5',
    name: 'Quinoa Power Salad',
    description: 'A vibrant mix of quinoa, roasted vegetables, chickpeas, and a zesty lemon-tahini dressing.',
    price: 15.00,
    imageId: 'salad-bowl',
    category: 'main-courses',
    tags: ['veg', 'gluten-free'],
    ingredients: ['Quinoa', 'Bell Peppers', 'Zucchini', 'Chickpeas', 'Lemon', 'Tahini'],
  },
  {
    id: 'item-6',
    name: 'Spicy Chicken Sandwich',
    description: 'Crispy fried chicken breast with a spicy slaw and pickles on a toasted brioche bun.',
    price: 16.50,
    imageId: 'sandwich',
    category: 'main-courses',
    tags: ['spicy'],
    ingredients: ['Chicken Breast', 'Brioche Bun', 'Cabbage', 'Mayonnaise', 'Spices', 'Pickles'],
  },
  {
    id: 'item-7',
    name: 'Classic Iced Tea',
    description: 'Freshly brewed black tea, lightly sweetened and served over ice with a lemon wedge.',
    price: 4.00,
    imageId: 'iced-tea',
    category: 'drinks',
    tags: ['veg', 'gluten-free'],
    ingredients: ['Black Tea', 'Water', 'Sugar', 'Lemon'],
  },
  {
    id: 'item-8',
    name: 'Truffle Mushroom Risotto',
    description: 'Creamy arborio rice infused with black truffle oil, wild mushrooms, and aged parmesan.',
    price: 22.00,
    imageId: 'risotto',
    category: 'main-courses',
    tags: ['veg'],
    ingredients: ['Arborio Rice', 'Mushrooms', 'Truffle Oil', 'Parmesan', 'White Wine', 'Vegetable Stock'],
  },
  {
    id: 'item-9',
    name: 'Matcha Latte',
    description: 'Ceremonial grade matcha whisked with steamed milk and a hint of honey. Calm meets energy.',
    price: 7.50,
    imageId: 'matcha',
    category: 'drinks',
    tags: ['veg', 'new'],
    ingredients: ['Matcha Powder', 'Milk', 'Honey'],
  },
  {
    id: 'item-10',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with layers of espresso-soaked ladyfingers and mascarpone cream.',
    price: 9.00,
    imageId: 'tiramisu',
    category: 'desserts',
    tags: ['veg'],
    ingredients: ['Ladyfinger Biscuits', 'Espresso', 'Mascarpone', 'Cocoa Powder', 'Eggs', 'Sugar'],
  },
];

// Initialize mock data to Firestore
export async function initializeMockData() {
  try {
    const menuCollection = collection(db, 'menu');
    const existingDocs = await getDocs(menuCollection);
    
    // Only initialize if collection is empty
    if (existingDocs.empty) {
      for (const item of MOCK_MENU_ITEMS) {
        await setDoc(doc(menuCollection, item.id), {
          ...item,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }
      console.log('Mock data initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing mock data:', error);
  }
}

// Get all menu items
export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'menu'));
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    } as MenuItem));
  } catch (error) {
    console.error('Error getting menu items:', error);
    return [];
  }
}

// Get menu items by category
export async function getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
  try {
    const q = query(collection(db, 'menu'), where('category', '==', category));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    } as MenuItem));
  } catch (error) {
    console.error('Error getting menu items by category:', error);
    return [];
  }
}

// Get single menu item
export async function getMenuItem(id: string): Promise<MenuItem | null> {
  try {
    const docSnap = await getDoc(doc(db, 'menu', id));
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id } as MenuItem;
    }
    return null;
  } catch (error) {
    console.error('Error getting menu item:', error);
    return null;
  }
}

// Add menu item
export async function addMenuItem(item: Omit<MenuItem, 'id'>): Promise<string> {
  try {
    const newId = `item-${Date.now()}`;
    await setDoc(doc(db, 'menu', newId), {
      ...item,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return newId;
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
}

// Update menu item
export async function updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<void> {
  try {
    await updateDoc(doc(db, 'menu', id), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
}

// Delete menu item
export async function deleteMenuItem(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'menu', id));
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
}

// Subscribe to menu items (realtime)
export function subscribeToMenuItems(callback: (items: MenuItem[]) => void): () => void {
  try {
    const unsubscribe = onSnapshot(
      collection(db, 'menu'),
      (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        } as MenuItem));
        callback(items);
      },
      (error) => {
        console.error('Error subscribing to menu items:', error);
        // Fallback to mock data if permission denied
        if (error.code === 'permission-denied') {
          callback(MOCK_MENU_ITEMS);
        }
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to menu items:', error);
    // Return mock data if there's an error
    callback(MOCK_MENU_ITEMS);
    return () => {};
  }
}

// Subscribe to menu items by category (realtime)
export function subscribeToMenuItemsByCategory(
  category: string,
  callback: (items: MenuItem[]) => void
): () => void {
  try {
    const q = query(collection(db, 'menu'), where('category', '==', category));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        } as MenuItem));
        callback(items);
      },
      (error) => {
        console.error('Error subscribing to menu items by category:', error);
        // Fallback to mock data if permission denied
        if (error.code === 'permission-denied') {
          const filteredItems = MOCK_MENU_ITEMS.filter((item) => item.category === category);
          callback(filteredItems);
        }
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to menu items by category:', error);
    // Return filtered mock data if there's an error
    const filteredItems = MOCK_MENU_ITEMS.filter((item) => item.category === category);
    callback(filteredItems);
    return () => {};
  }
}
