import type { Review, SpiceLevel, DietaryPreference } from '@/types';

const REVIEWER_NAMES = [
  'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Neha Gupta', 'Vikram Singh',
  'Ananya Reddy', 'Karan Mehta', 'Sneha Iyer', 'Arjun Nair', 'Pooja Joshi',
  'Rohan Das', 'Meera Kapoor', 'Aditya Verma', 'Divya Shah', 'Sanjay Rao',
  'Kavitha Menon', 'Ravi Krishnan', 'Anjali Desai', 'Manish Agarwal', 'Swati Chopra',
  'Deepak Mishra', 'Nisha Bhatia', 'Suresh Pillai', 'Ritu Saxena', 'Ajay Malhotra',
  'Preeti Banerjee', 'Vishal Tiwari', 'Sunita Chauhan', 'Gaurav Pandey', 'Lakshmi Nayak',
];

const POSITIVE_COMMENTS = [
  "Absolutely delicious! Will definitely order again.",
  "Best I've had in a long time. Highly recommended!",
  "Fresh ingredients and great taste. Love it!",
  "Perfect portion size and amazing flavors.",
  "My new favorite! The taste is incredible.",
  "Exceeded my expectations. Truly fantastic!",
  "Amazing quality and presentation. Worth every rupee!",
  "Can't stop thinking about this dish. So good!",
  "The flavors are perfectly balanced. Chef's kiss!",
  "Outstanding! Everyone in my family loved it.",
  "Fresh, tasty, and beautifully presented.",
  "This is exactly what I was craving. Perfect!",
  "Top-notch quality. Will be a regular customer.",
  "Authentic taste and generous portions.",
  "Simply the best! No complaints at all.",
];

const NEUTRAL_COMMENTS = [
  "Good food, decent portion size.",
  "Nice taste, could be a bit spicier.",
  "Satisfying meal, would try again.",
  "Pretty good overall experience.",
  "Tasty but nothing extraordinary.",
  "Solid choice for a quick meal.",
  "Good value for money.",
  "Decent quality, met expectations.",
];

const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(daysBack: number = 90): Date {
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * daysBack * 24 * 60 * 60 * 1000);
  return pastDate;
}

function generateAvatar(name: string): string {
  const color = getRandomItem(AVATAR_COLORS);
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${color.slice(1)}&color=fff&size=64`;
}

export function generateFakeReview(menuItemId: string): Review {
  const name = getRandomItem(REVIEWER_NAMES);
  const rating = Math.random() > 0.15 
    ? getRandomNumber(4, 5) 
    : getRandomNumber(3, 4);
  
  const comment = rating >= 4 
    ? getRandomItem(POSITIVE_COMMENTS)
    : getRandomItem(NEUTRAL_COMMENTS);
  
  return {
    id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    menuItemId,
    reviewerName: name,
    reviewerAvatar: generateAvatar(name),
    rating,
    comment,
    date: getRandomDate(90),
    isVerified: Math.random() > 0.3,
    helpful: getRandomNumber(0, 50),
  };
}

export function generateMultipleFakeReviews(menuItemId: string, count: number = 5): Review[] {
  const reviews: Review[] = [];
  const usedNames = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    let name = getRandomItem(REVIEWER_NAMES);
    while (usedNames.has(name) && usedNames.size < REVIEWER_NAMES.length) {
      name = getRandomItem(REVIEWER_NAMES);
    }
    usedNames.add(name);
    
    const rating = Math.random() > 0.15 
      ? getRandomNumber(4, 5) 
      : getRandomNumber(3, 4);
    
    const comment = rating >= 4 
      ? getRandomItem(POSITIVE_COMMENTS)
      : getRandomItem(NEUTRAL_COMMENTS);
    
    reviews.push({
      id: `review-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
      menuItemId,
      reviewerName: name,
      reviewerAvatar: generateAvatar(name),
      rating,
      comment,
      date: getRandomDate(90),
      isVerified: Math.random() > 0.3,
      helpful: getRandomNumber(0, 50),
    });
  }
  
  return reviews.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function generateFakeBuyerCount(): number {
  return getRandomNumber(50, 2500);
}

export function generateFakeOrderCount(): number {
  return getRandomNumber(100, 5000);
}

export function generateFakePrepTime(category: string): number {
  const prepTimes: Record<string, [number, number]> = {
    'drinks': [3, 8],
    'breakfast': [10, 20],
    'main-courses': [15, 35],
    'desserts': [5, 15],
    'snacks': [8, 15],
  };
  const [min, max] = prepTimes[category] || [10, 25];
  return getRandomNumber(min, max);
}

export function generateFakeCalories(category: string): number {
  const calorieRanges: Record<string, [number, number]> = {
    'drinks': [50, 350],
    'breakfast': [250, 600],
    'main-courses': [400, 900],
    'desserts': [200, 550],
    'snacks': [150, 400],
  };
  const [min, max] = calorieRanges[category] || [200, 500];
  return getRandomNumber(min, max);
}

export function generateFakeSpiceLevel(): SpiceLevel | undefined {
  const levels: (SpiceLevel | undefined)[] = ['mild', 'medium', 'hot', 'extra-hot', undefined];
  return getRandomItem(levels);
}

export function generateFakeDietary(): DietaryPreference[] {
  const allPreferences: DietaryPreference[] = ['veg', 'vegan', 'gluten-free', 'dairy-free', 'nut-free'];
  const count = getRandomNumber(0, 2);
  const shuffled = [...allPreferences].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export interface FakeSocialProofData {
  rating: number;
  reviewCount: number;
  reviews: Review[];
  totalBuyers: number;
  orderCount: number;
  prepTime: number;
  calories: number;
  spiceLevel?: SpiceLevel;
  dietary: DietaryPreference[];
  isPopular: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
}

export function generateCompleteFakeSocialProof(
  menuItemId: string, 
  category: string,
  reviewCount: number = 5
): FakeSocialProofData {
  const reviews = generateMultipleFakeReviews(menuItemId, reviewCount);
  const rating = calculateAverageRating(reviews);
  const totalBuyers = generateFakeBuyerCount();
  const orderCount = generateFakeOrderCount();
  
  return {
    rating,
    reviewCount: reviews.length,
    reviews,
    totalBuyers,
    orderCount,
    prepTime: generateFakePrepTime(category),
    calories: generateFakeCalories(category),
    spiceLevel: generateFakeSpiceLevel(),
    dietary: generateFakeDietary(),
    isPopular: totalBuyers > 1000,
    isTrending: orderCount > 2000 && Math.random() > 0.5,
    isBestSeller: orderCount > 3000 && rating >= 4.5,
  };
}

export { REVIEWER_NAMES, POSITIVE_COMMENTS, NEUTRAL_COMMENTS };
