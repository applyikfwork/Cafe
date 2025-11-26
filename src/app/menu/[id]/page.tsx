'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { formatCurrency } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Price } from '@/components/ui/price';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useActivePromotions } from '@/hooks/usePromotions';
import { ArrowLeft, Star, Leaf, Flame, ShieldCheck, TrendingUp, ImageIcon } from 'lucide-react';
import type { Tag } from '@/types';

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
  new: Star,
};

function MenuItemContent() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;
  const { items: menuItems } = useMenuItems();
  const { promotions: activePromotions } = useActivePromotions();
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [relatedItems, setRelatedItems] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const item = menuItems.find(m => m.id === itemId);
    if (item) {
      setCurrentItem(item);
      const related = menuItems.filter(m => m.category === item.category && m.id !== itemId).slice(0, 3);
      setRelatedItems(related);
    }
  }, [itemId, menuItems, mounted]);

  if (!currentItem) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground text-lg mb-4">Item not found</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const itemImage = PlaceHolderImages.find(img => img.id === currentItem.imageId);
  const hasUploadedImage = currentItem.imageUrl && currentItem.imageUrl.startsWith('http');

  const getItemPromotion = (itemId: string) => {
    const now = new Date();
    const eligible = activePromotions.filter(p => {
      if (!p.active || !p.type || typeof p.value !== 'number') return false;
      if (new Date(p.startDate) > now || new Date(p.endDate) < now) return false;
      const isGlobal = !p.applicableItems || p.applicableItems.length === 0;
      const isApplicable = isGlobal || (p.applicableItems && p.applicableItems.includes(itemId));
      return isApplicable;
    });
    return eligible[0];
  };

  const promotion = getItemPromotion(currentItem.id);
  const discountedPrice = promotion && promotion.type ? currentItem.price * (promotion.type === 'percentage' ? (1 - promotion.value / 100) : (promotion.value >= currentItem.price ? 0 : 1 - promotion.value / currentItem.price)) : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: currentItem.name,
    description: currentItem.description,
    image: hasUploadedImage ? currentItem.imageUrl : itemImage?.imageUrl,
    offers: {
      '@type': 'Offer',
      price: promotion && discountedPrice ? discountedPrice.toFixed(2) : currentItem.price.toFixed(2),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock'
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-8 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <ScrollReveal direction="left">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
                {hasUploadedImage ? (
                  <img src={currentItem.imageUrl} alt={currentItem.name} className="w-full h-full object-cover" />
                ) : itemImage ? (
                  <Image src={itemImage.imageUrl} alt={currentItem.name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-24 w-24 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="flex flex-col justify-center">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-5xl font-bold mb-2">{currentItem.name}</h1>
                    {currentItem.tags.includes('new') && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0">
                        <Star className="h-3 w-3 mr-1" />
                        NEW
                      </Badge>
                    )}
                  </div>
                  {promotion && promotion.type && (
                    <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 text-base px-4 py-2">
                      {promotion.type === 'percentage' ? `${promotion.value}% OFF` : `₹${promotion.value} OFF`}
                    </Badge>
                  )}
                </div>

                <p className="text-lg text-muted-foreground mb-6">{currentItem.description}</p>

                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Ingredients:</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentItem.ingredients.map((ing: string) => (
                      <Badge key={ing} variant="outline">{ing}</Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-semibold mb-3">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentItem.tags.map((tag: Tag) => {
                      const Icon = tagIcons[tag];
                      return (
                        <Badge key={tag} variant="outline" className={tagColors[tag]}>
                          <Icon className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-8 pt-6 border-t">
                  <div className="flex items-baseline gap-4 mb-6">
                    {discountedPrice ? (
                      <>
                        <Price amount={discountedPrice} className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent" />
                        <span className="text-2xl text-muted-foreground line-through">
                          <Price amount={currentItem.price} />
                        </span>
                      </>
                    ) : (
                      <Price amount={currentItem.price} className="text-4xl font-bold text-primary" />
                    )}
                  </div>
                  <Button size="lg" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    Add to Order
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {relatedItems.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Related Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedItems.map((item, idx) => {
                  const img = PlaceHolderImages.find(i => i.id === item.imageId);
                  return (
                    <ScrollReveal key={item.id} direction="up" delay={idx * 0.1}>
                      <Card className="group cursor-pointer hover:shadow-lg transition-all" onClick={() => router.push(`/menu/${item.id}`)}>
                        <div className="aspect-square relative overflow-hidden rounded-t-lg bg-muted">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          ) : img ? (
                            <Image src={img.imageUrl} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                          ) : null}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg mb-2 line-clamp-1">{item.name}</h3>
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{item.description}</p>
                          <Price amount={item.price} className="text-2xl font-bold text-primary" />
                        </CardContent>
                      </Card>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Footer />
    </div>
  );
}

export default function MenuItemPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <MenuItemContent />
    </Suspense>
  );
}
