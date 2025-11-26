'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
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
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Tag, MenuItem } from '@/types';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useActivePromotions } from '@/hooks/usePromotions';
import { useCategories } from '@/hooks/use-categories';
import { initializeMockData } from '@/lib/firestore-service';
import { Search, Sparkles, TrendingUp, Leaf, Flame, ShieldCheck, Star, ChefHat, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { SwipeableMenuCards } from '@/components/menu/swipeable-menu-cards';
import { CategoryPills } from '@/components/menu/category-pills';
import { FullScreenItemPreview } from '@/components/menu/full-screen-item-preview';
import { StickyCartBar } from '@/components/menu/sticky-cart-bar';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Array<{ item: MenuItem; quantity: number }>>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    initializeMockData();
  }, []);

  const filterItems = (items: typeof menuItems) => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.some(tag => item.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
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

  const handleAddToCart = (item: MenuItem, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      }
      return [...prev, { item, quantity }];
    });
  };

  const cartTotal = cartItems.reduce((total, ci) => {
    const promotion = getItemPromotion(ci.item.id);
    const discountedPrice = calculateDiscountedPrice(ci.item.price, promotion);
    return total + (discountedPrice || ci.item.price) * ci.quantity;
  }, 0);

  const renderMenuGrid = (items: typeof menuItems) => {
    const filteredItems = filterItems(items);
    
    if (filteredItems.length === 0) {
      return (
        <div className="text-center py-16">
          <ChefHat className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No items found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              setSelectedTags([]);
            }}
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
            onItemClick={(item) => {
              setSelectedItem(item);
              setIsPreviewOpen(true);
            }}
            getItemPromotion={getItemPromotion}
            calculateDiscountedPrice={calculateDiscountedPrice}
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => {
          const itemImage = PlaceHolderImages.find((img) => img.id === item.imageId);
          const promotion = getItemPromotion(item.id);
          const discountedPrice = promotion ? calculateDiscountedPrice(item.price, promotion) : null;
          
          const hasUploadedImage = item.imageUrl && item.imageUrl.startsWith('http');
          
          return (
            <ScrollReveal key={item.id} direction="up" delay={index * 0.05}>
              <Card 
                className="group relative flex flex-col h-full hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 overflow-hidden bg-card/50 backdrop-blur-sm cursor-pointer"
                onClick={() => {
                  setSelectedItem(item);
                  setIsPreviewOpen(true);
                }}
              >
                {promotion && promotion.type && promotion.value !== undefined && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg animate-pulse">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {promotion.type === 'percentage' ? `${promotion.value}% OFF` : 
                       promotion.type === 'fixed' ? `₹${promotion.value} OFF` : 'SPECIAL'}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="p-0 relative overflow-hidden">
                  <div className="aspect-[4/3] relative">
                    {hasUploadedImage ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                      />
                    ) : itemImage ? (
                      <Image
                        src={itemImage.imageUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                        data-ai-hint={itemImage.imageHint}
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    
                    {item.tags.includes('new' as Tag) && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-lg">
                          <Star className="h-3 w-3 mr-1" />
                          NEW
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-5 flex flex-col flex-1">
                  <h3 className="font-headline text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-muted-foreground text-sm flex-grow leading-relaxed line-clamp-2 mb-3">
                    {item.description}
                  </p>
                
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.tags.filter(tag => tag !== 'new').map(tag => {
                      const Icon = tagIcons[tag];
                      return (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className={`${tagColors[tag]} text-xs transition-all group-hover:scale-105`}
                        >
                          <Icon className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-end mt-auto pt-3 border-t">
                    <div className="flex flex-col">
                      {discountedPrice !== null ? (
                        <>
                          <span className="text-sm text-muted-foreground line-through">
                            <span className="currency-symbol">₹</span>{new Intl.NumberFormat('en-IN').format(item.price)}
                          </span>
                          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                            <span className="currency-symbol">₹</span>{new Intl.NumberFormat('en-IN').format(discountedPrice)}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-primary">
                          <span className="currency-symbol">₹</span>{new Intl.NumberFormat('en-IN').format(item.price)}
                        </span>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 group-hover:scale-105 transition-all shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item, 1);
                      }}
                    >
                      Add to Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
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

          <ScrollReveal direction="up" delay={0.1} className="max-w-2xl mx-auto mb-8">
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
