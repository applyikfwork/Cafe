'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { TodaysSpecialBanner } from '@/components/ui/todays-special-banner';
import { Badge } from '@/components/ui/badge';
import type { Tag, MenuItem, SortOption, SpiceLevel, DietaryPreference } from '@/types';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useActivePromotions } from '@/hooks/usePromotions';
import { useCategories } from '@/hooks/use-categories';
import { useMenuFavorites } from '@/hooks/useMenuFavorites';
import { initializeMockData } from '@/lib/firestore-service';
import { useToast } from '@/hooks/use-toast';
import { Search, Sparkles, Leaf, Flame, ShieldCheck, ChefHat, LayoutGrid, List, Layers } from 'lucide-react';
import { StickyCartBar } from '@/components/menu/sticky-cart-bar';
import { SmartFilterBar } from '@/components/menu/smart-filter-bar';
import { TrendingSection } from '@/components/menu/trending-section';
import { RecentlyViewedSection } from '@/components/menu/recently-viewed-section';
import { FavoritesSection } from '@/components/menu/favorites-section';
import { RecommendedSection } from '@/components/menu/recommended-section';
import { useIsMobile } from '@/hooks/use-mobile';
import { CategoryStoryCarousel } from '@/components/menu/category-story-carousel';
import { FloatingCategoryNav } from '@/components/menu/floating-category-nav';
import { AccordionMenuSections } from '@/components/menu/accordion-menu-sections';
import { ViewModeToggle } from '@/components/menu/view-mode-toggle';
import { AnimatedMenuCard } from '@/components/menu/animated-menu-card';
import { MenuItemListCard } from '@/components/menu/menu-item-list-card';
import { SwipeableItemPreview } from '@/components/menu/swipeable-item-preview';
import { motion, AnimatePresence } from 'framer-motion';

type ViewMode = 'grid' | 'list';
type DisplayMode = 'categories' | 'all';

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
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Array<{ item: MenuItem; quantity: number }>>([]);
  const isMobile = useIsMobile();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('categories');
  const [showFloatingNav, setShowFloatingNav] = useState(false);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedDietary, setSelectedDietary] = useState<DietaryPreference[]>([]);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<SpiceLevel | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('popularity');

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

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingNav(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const maxPrice = useMemo(() => {
    if (menuItems.length === 0) return 1000;
    return Math.max(...menuItems.map(item => item.price)) + 100;
  }, [menuItems]);

  useEffect(() => {
    if (menuItems.length > 0 && priceRange[1] === 1000) {
      setPriceRange([0, maxPrice]);
    }
  }, [menuItems, maxPrice, priceRange]);

  const trendingItems = useMemo(() => {
    return [...menuItems]
      .sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0))
      .slice(0, 5)
      .map(item => ({ ...item, isTrending: true }));
  }, [menuItems]);

  const favoriteItems = useMemo(() => {
    return menuItems.filter(item => favorites.includes(item.id));
  }, [menuItems, favorites]);

  const recentlyViewedItems = useMemo(() => {
    return recentlyViewed
      .map(id => menuItems.find(item => item.id === id))
      .filter((item): item is MenuItem => item !== undefined);
  }, [menuItems, recentlyViewed]);

  const recommendedItems = useMemo(() => {
    const viewedCategories = new Set([
      ...favoriteItems.map(i => i.category),
      ...recentlyViewedItems.map(i => i.category)
    ]);
    
    if (viewedCategories.size === 0) {
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

  const filterItems = useCallback((items: MenuItem[]) => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.some(tag => item.tags.includes(tag));
      
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
      
      const matchesDietary = selectedDietary.length === 0 ||
                            selectedDietary.some(d => 
                              item.dietary?.includes(d) || 
                              (d === 'veg' && item.tags.includes('veg')) ||
                              (d === 'gluten-free' && item.tags.includes('gluten-free'))
                            );
      
      const matchesSpice = !selectedSpiceLevel || 
                          item.spiceLevel === selectedSpiceLevel ||
                          (selectedSpiceLevel && item.tags.includes('spicy'));
      
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      return matchesSearch && matchesTags && matchesPrice && matchesDietary && matchesSpice && matchesCategory;
    });
  }, [searchQuery, selectedTags, priceRange, selectedDietary, selectedSpiceLevel, selectedCategory]);

  const sortItems = useCallback((items: MenuItem[]) => {
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
  }, [sortOption]);

  const filteredAndSortedItems = useMemo(() => {
    return sortItems(filterItems(menuItems));
  }, [menuItems, filterItems, sortItems]);

  const toggleTag = (tag: Tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const getItemPromotion = useCallback((itemId: string) => {
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
  }, [activePromotions]);

  const calculateDiscountedPrice = useCallback((price: number, promotion: any) => {
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
  }, []);

  const handleAddToCart = useCallback((item: MenuItem, quantity: number = 1) => {
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
  }, [toast]);

  const handleItemClick = useCallback((item: MenuItem) => {
    const index = filteredAndSortedItems.findIndex(i => i.id === item.id);
    setSelectedItemIndex(index >= 0 ? index : 0);
    setIsPreviewOpen(true);
    addToRecentlyViewed(item.id);
  }, [filteredAndSortedItems, addToRecentlyViewed]);

  const handleNavigatePreview = useCallback((index: number) => {
    setSelectedItemIndex(index);
    if (filteredAndSortedItems[index]) {
      addToRecentlyViewed(filteredAndSortedItems[index].id);
    }
  }, [filteredAndSortedItems, addToRecentlyViewed]);

  const cartTotal = cartItems.reduce((total, ci) => {
    const promotion = getItemPromotion(ci.item.id);
    const discountedPrice = calculateDiscountedPrice(ci.item.price, promotion);
    return total + (discountedPrice || ci.item.price) * ci.quantity;
  }, 0);

  const renderMenuCard = useCallback((item: MenuItem, index: number) => {
    const promotion = getItemPromotion(item.id);
    const discountedPrice = promotion ? calculateDiscountedPrice(item.price, promotion) : null;
    
    if (viewMode === 'list') {
      return (
        <MenuItemListCard
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
    }

    return (
      <AnimatedMenuCard
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
  }, [viewMode, getItemPromotion, calculateDiscountedPrice, isFavorite, handleItemClick, handleAddToCart, toggleFavorite]);

  const renderMenuContent = () => {
    if (filteredAndSortedItems.length === 0) {
      return (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
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
        </motion.div>
      );
    }

    if (displayMode === 'categories' && selectedCategory === 'all') {
      return (
        <AccordionMenuSections
          categories={categories}
          menuItems={filteredAndSortedItems}
          renderItem={renderMenuCard}
          viewMode={viewMode}
          defaultExpanded={categories.slice(0, 2).map(c => c.id)}
        />
      );
    }

    return (
      <motion.div 
        className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6' 
          : 'space-y-3 md:space-y-4'
        }
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredAndSortedItems.map((item, index) => renderMenuCard(item, index))}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      <TodaysSpecialBanner />
      
      <main className="flex-1 pb-24">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <ScrollReveal direction="up" className="text-center mb-6 md:mb-8">
            <h1 className="text-4xl md:text-6xl font-headline font-bold bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent mb-3">
              Our Menu
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover handcrafted dishes made with love
            </p>
          </ScrollReveal>

          {!loading && !categoriesLoading && (
            <CategoryStoryCarousel
              categories={categories}
              menuItems={menuItems}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          )}

          {trendingItems.length > 0 && (
            <TrendingSection
              items={trendingItems}
              onItemClick={handleItemClick}
              onQuickAdd={(item) => handleAddToCart(item, 1)}
              getItemPromotion={getItemPromotion}
              calculateDiscountedPrice={calculateDiscountedPrice}
            />
          )}

          {favMounted && recentlyViewedItems.length > 0 && (
            <RecentlyViewedSection
              items={recentlyViewedItems}
              onItemClick={handleItemClick}
              onClear={clearRecentlyViewed}
            />
          )}

          {favMounted && favoriteItems.length > 0 && (
            <FavoritesSection
              items={favoriteItems}
              onItemClick={handleItemClick}
              onQuickAdd={(item) => handleAddToCart(item, 1)}
              onRemoveFavorite={toggleFavorite}
            />
          )}

          {favMounted && recommendedItems.length > 0 && (
            <RecommendedSection
              items={recommendedItems}
              onItemClick={handleItemClick}
              onQuickAdd={(item) => handleAddToCart(item, 1)}
            />
          )}

          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md py-4 -mx-4 px-4 mb-6 border-b border-border/50">
            <div className="max-w-2xl mx-auto mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base bg-card/50 border-2 focus:border-primary rounded-xl"
                />
              </div>
            </div>

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

            <div className="flex items-center justify-between mt-4 gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                {(['veg', 'spicy', 'gluten-free', 'new'] as Tag[]).map((tag) => {
                  const Icon = tagIcons[tag];
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <Button
                      key={tag}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTag(tag)}
                      className={`h-8 text-xs ${isSelected ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', ' ')}
                    </Button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={displayMode === 'categories' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDisplayMode(displayMode === 'categories' ? 'all' : 'categories')}
                  className="h-8"
                >
                  <Layers className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">
                    {displayMode === 'categories' ? 'Sections' : 'All'}
                  </span>
                </Button>
                <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
              </div>
            </div>
          </div>

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
            renderMenuContent()
          )}
        </div>
      </main>

      <SwipeableItemPreview
        items={filteredAndSortedItems}
        currentIndex={selectedItemIndex}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onAddToCart={handleAddToCart}
        onNavigate={handleNavigatePreview}
        getItemPromotion={getItemPromotion}
        calculateDiscountedPrice={calculateDiscountedPrice}
      />

      {showFloatingNav && (
        <FloatingCategoryNav
          categories={categories}
          menuItems={menuItems}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      )}

      <StickyCartBar
        cartCount={cartItems.reduce((sum, ci) => sum + ci.quantity, 0)}
        cartTotal={cartTotal}
        cartItems={cartItems}
      />
      
      <Footer />
    </div>
  );
}
