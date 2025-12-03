'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { TodaysSpecialBanner } from '@/components/ui/todays-special-banner';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import type { Tag, MenuItem, SortOption, SpiceLevel, DietaryPreference } from '@/types';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useActivePromotions } from '@/hooks/usePromotions';
import { useCategories } from '@/hooks/use-categories';
import { useMenuFavorites } from '@/hooks/useMenuFavorites';
import { initializeMockData } from '@/lib/firestore-service';
import { useToast } from '@/hooks/use-toast';
import { Search, Sparkles, TrendingUp, Leaf, Flame, ShieldCheck, Star, ChefHat, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { SwipeableMenuCards } from '@/components/menu/swipeable-menu-cards';
import { CategoryPills } from '@/components/menu/category-pills';
import { FullScreenItemPreview } from '@/components/menu/full-screen-item-preview';
import { StickyCartBar } from '@/components/menu/sticky-cart-bar';
import { SmartFilterBar } from '@/components/menu/smart-filter-bar';
import { TrendingSection } from '@/components/menu/trending-section';
import { RecentlyViewedSection } from '@/components/menu/recently-viewed-section';
import { FavoritesSection } from '@/components/menu/favorites-section';
import { RecommendedSection } from '@/components/menu/recommended-section';
import { EnhancedMenuCard } from '@/components/menu/enhanced-menu-card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Price } from '@/components/ui/price';

const tagColors: Record<Tag, string> = {
  veg: 'border-green-500/80 bg-green-500/10 text-green-700 dark:text-green-400',
  spicy: 'border-red-500/80 bg-red-500/10 text-red-700 dark:text-red-400',
  'gluten-free': 'border-blue-500/80 bg-blue-500/10 text-blue-700 dark:text-blue-400',
  new: 'border-yellow-500/80 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
};

const tagIcons: Record<Tag, any> = {
  veg: Leaf,
  spicy: Flame,
  'gluten-free': ShieldCheck,
  new: Sparkles,
};

export default function MenuPage() {
  const { items: menuItems, loading } = useMenuItems();
  const { promotions: activePromotions } = useActivePromotions();
  const { categories, loading: categoriesLoading } = useCategories();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Array<{ item: MenuItem; quantity: number }>>([]);
  const isMobile = useIsMobile();

  // Smart filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedDietary, setSelectedDietary] = useState<DietaryPreference[]>([]);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<SpiceLevel | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('popularity');

  // Favorites and Recently Viewed
  const { 
    favorites, 
    recentlyViewed, 
    toggleFavorite, 
    isFavorite, 
    addToRecentlyViewed,
    clearRecentlyViewed,
    mounted: favMounted 
  } = useMenuFavorites();

  useEffect(() => {
    initializeMockData();
  }, []);

  // Calculate max price from menu items
  const maxPrice = useMemo(() => {
    if (menuItems.length === 0) return 1000;
    return Math.max(...menuItems.map(item => item.price)) + 100;
  }, [menuItems]);

  // Initialize price range when items load
  useEffect(() => {
    if (menuItems.length > 0 && priceRange[1] === 1000) {
      setPriceRange([0, maxPrice]);
    }
  }, [menuItems, maxPrice, priceRange]);

  // Get trending items (top 5 by order count/popularity)
  const trendingItems = useMemo(() => {
    return [...menuItems]
      .sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0))
      .slice(0, 5)
      .map(item => ({ ...item, isTrending: true }));
  }, [menuItems]);

  // Get favorite items
  const favoriteItems = useMemo(() => {
    return menuItems.filter(item => favorites.includes(item.id));
  }, [menuItems, favorites]);

  // Get recently viewed items
  const recentlyViewedItems = useMemo(() => {
    return recentlyViewed
      .map(id => menuItems.find(item => item.id === id))
      .filter((item): item is MenuItem => item !== undefined);
  }, [menuItems, recentlyViewed]);

  // Get recommended items based on favorites and recently viewed categories
  const recommendedItems = useMemo(() => {
    const viewedCategories = new Set([
      ...favoriteItems.map(i => i.category),
      ...recentlyViewedItems.map(i => i.category)
    ]);
    
    if (viewedCategories.size === 0) {
      // If no history, return random high-rated items
      return [...menuItems]
        .sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5))
        .slice(0, 6);
    }

    return menuItems
      .filter(item => 
        viewedCategories.has(item.category) && 
        !favorites.includes(item.id) &&
        !recentlyViewed.includes(item.id)
      )
      .sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5))
      .slice(0, 6);
  }, [menuItems, favoriteItems, recentlyViewedItems, favorites, recentlyViewed]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedDietary.length > 0) count += selectedDietary.length;
    if (selectedSpiceLevel) count++;
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) count++;
    return count;
  }, [selectedDietary, selectedSpiceLevel, priceRange, maxPrice]);

  const clearAllFilters = () => {
    setPriceRange([0, maxPrice]);
    setSelectedDietary([]);
    setSelectedSpiceLevel(null);
    setSelectedTags([]);
    setSearchQuery('');
  };

  const filterItems = (items: typeof menuItems) => {
    return items.filter((item) => {
      // Search filter
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Tag filter
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.some(tag => item.tags.includes(tag));
      
      // Price filter
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
      
      // Dietary filter
      const matchesDietary = selectedDietary.length === 0 ||
                            selectedDietary.some(d => 
                              item.dietary?.includes(d) || 
                              (d === 'veg' && item.tags.includes('veg')) ||
                              (d === 'gluten-free' && item.tags.includes('gluten-free'))
                            );
      
      // Spice level filter
      const matchesSpice = !selectedSpiceLevel || 
                          item.spiceLevel === selectedSpiceLevel ||
                          (selectedSpiceLevel && item.tags.includes('spicy'));
      
      return matchesSearch && matchesTags && matchesPrice && matchesDietary && matchesSpice;
    });
  };

  const sortItems = (items: MenuItem[]) => {
    const sorted = [...items];
    switch (sortOption) {
      case 'popularity':
        return sorted.sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0));
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      default:
        return sorted;
    }
  };

  const toggleTag = (tag: Tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const getItemPromotion = (itemId: string) => {
    const now = new Date();
    const eligiblePromotions = activePromotions.filter(p => {
      if (!p.active || !p.type || typeof p.value !== 'number') return false;
      if (new Date(p.startDate) > now || new Date(p.endDate) < now) return false;
      
      const isGlobal = !p.applicableItems || p.applicableItems.length === 0;
      const isApplicable = isGlobal || (p.applicableItems && p.applicableItems.includes(itemId));
      
      return isApplicable;
    });
    
    const itemSpecific = eligiblePromotions.find(p => 
      p.applicableItems && p.applicableItems.length > 0 && p.applicableItems.includes(itemId)
    );
    
    return itemSpecific || eligiblePromotions[0];
  };

  const calculateDiscountedPrice = (price: number, promotion: any) => {
    if (!promotion || !promotion.type || typeof promotion.value !== 'number') {
      return null;
    }
    
    switch (promotion.type) {
      case 'percentage':
        if (promotion.value < 0 || promotion.value > 100) return null;
        return price * (1 - promotion.value / 100);
      case 'fixed':
        if (promotion.value < 0) return null;
        return Math.max(0, price - promotion.value);
      default:
        return null;
    }
  };

  const handleAddToCart = (item: MenuItem, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      }
      return [...prev, { item, quantity }];
    });
    toast({
      title: '✅ Added to Cart!',
      description: `${quantity}x ${item.name} added successfully`,
    });
  };

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsPreviewOpen(true);
    addToRecentlyViewed(item.id);
  };

  const cartTotal = cartItems.reduce((total, ci) => {
    const promotion = getItemPromotion(ci.item.id);
    const discountedPrice = calculateDiscountedPrice(ci.item.price, promotion);
    return total + (discountedPrice || ci.item.price) * ci.quantity;
  }, 0);

  const renderMenuGrid = (items: typeof menuItems) => {
    const filteredItems = sortItems(filterItems(items));
    
    if (filteredItems.length === 0) {
      return (
        <div className="text-center py-16">
          <ChefHat className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No items found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={clearAllFilters}
          >
            Clear Filters
          </Button>
        </div>
      );
    }

    // Mobile swipeable view
    if (isMobile) {
      return (
        <div className="space-y-4">
          <SwipeableMenuCards
            items={filteredItems}
            onItemClick={handleItemClick}
            getItemPromotion={getItemPromotion}
            calculateDiscountedPrice={calculateDiscountedPrice}
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => {
          const promotion = getItemPromotion(item.id);
          const discountedPrice = promotion ? calculateDiscountedPrice(item.price, promotion) : null;
          
          return (
            <EnhancedMenuCard
              key={item.id}
              item={item}
              index={index}
              isFavorite={isFavorite(item.id)}
              promotion={promotion}
              discountedPrice={discountedPrice}
              onItemClick={() => handleItemClick(item)}
              onQuickAdd={() => handleAddToCart(item, 1)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      <TodaysSpecialBanner />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <ScrollReveal direction="up" className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-headline font-bold bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent mb-4">
              Our Delicious Menu
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover handcrafted dishes made with love and the finest ingredients
            </p>
          </ScrollReveal>

          {/* Trending Section */}
          {trendingItems.length > 0 && (
            <TrendingSection
              items={trendingItems}
              onItemClick={handleItemClick}
              onQuickAdd={(item) => handleAddToCart(item, 1)}
              getItemPromotion={getItemPromotion}
              calculateDiscountedPrice={calculateDiscountedPrice}
            />
          )}

          {/* Recently Viewed Section */}
          {favMounted && recentlyViewedItems.length > 0 && (
            <RecentlyViewedSection
              items={recentlyViewedItems}
              onItemClick={handleItemClick}
              onClear={clearRecentlyViewed}
            />
          )}

          {/* Favorites Section */}
          {favMounted && favoriteItems.length > 0 && (
            <FavoritesSection
              items={favoriteItems}
              onItemClick={handleItemClick}
              onQuickAdd={(item) => handleAddToCart(item, 1)}
              onRemoveFavorite={toggleFavorite}
            />
          )}

          {/* Recommended Section */}
          {favMounted && recommendedItems.length > 0 && (
            <RecommendedSection
              items={recommendedItems}
              onItemClick={handleItemClick}
              onQuickAdd={(item) => handleAddToCart(item, 1)}
            />
          )}

          {/* Search Bar */}
          <ScrollReveal direction="up" delay={0.1} className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base bg-card/50 backdrop-blur-sm border-2 focus:border-primary"
              />
            </div>
          </ScrollReveal>

          {/* Smart Filter Bar */}
          <ScrollReveal direction="up" delay={0.15}>
            <SmartFilterBar
              priceRange={priceRange}
              maxPrice={maxPrice}
              onPriceRangeChange={setPriceRange}
              selectedDietary={selectedDietary}
              onDietaryChange={setSelectedDietary}
              selectedSpiceLevel={selectedSpiceLevel}
              onSpiceLevelChange={setSelectedSpiceLevel}
              sortOption={sortOption}
              onSortChange={setSortOption}
              onClearFilters={clearAllFilters}
              activeFilterCount={activeFilterCount}
            />
          </ScrollReveal>

          {/* Category Pills - Mobile Optimized */}
          <ScrollReveal direction="up" delay={0.1} className="mb-8">
            <CategoryPills
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={(categoryId) => {
                setSelectedCategory(categoryId);
              }}
            />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2} className="flex flex-wrap justify-center gap-3 mb-10">
            {(['veg', 'spicy', 'gluten-free', 'new'] as Tag[]).map((tag) => {
              const Icon = tagIcons[tag];
              const isSelected = selectedTags.includes(tag);
              return (
                <Button
                  key={tag}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTag(tag)}
                  className={`transition-all ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </Button>
              );
            })}
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTags([])}
                className="text-muted-foreground"
              >
                Clear All
              </Button>
            )}
          </ScrollReveal>

          {loading || categoriesLoading ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                  <ChefHat className="h-8 w-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
                </div>
                <p className="text-muted-foreground text-lg font-medium">Loading delicious options...</p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-center mb-8 hidden md:block">
                <TabsList className="bg-card/50 backdrop-blur-sm p-1.5 shadow-lg border">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white px-6"
                  >
                    All Items
                  </TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white px-6"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value="all" className="mt-0">
                {renderMenuGrid(menuItems)}
              </TabsContent>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="mt-0">
                  {renderMenuGrid(menuItems.filter(item => item.category === category.id))}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </main>

      {/* Full Screen Item Preview Modal */}
      <FullScreenItemPreview
        item={selectedItem}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onAddToCart={handleAddToCart}
        promotion={selectedItem ? getItemPromotion(selectedItem.id) : null}
        calculateDiscountedPrice={calculateDiscountedPrice}
      />

      {/* Sticky Cart Bar - Mobile Only */}
      <StickyCartBar
        cartCount={cartItems.reduce((sum, ci) => sum + ci.quantity, 0)}
        cartTotal={cartTotal}
      />
      
      <Footer />
    </div>
  );
}
