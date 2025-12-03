'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Price } from '@/components/ui/price';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { TrendingUp, Star, Clock, ChevronLeft, ChevronRight, Flame, ImageIcon } from 'lucide-react';
import type { MenuItem } from '@/types';

interface TrendingSectionProps {
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
  getItemPromotion: (itemId: string) => any;
  calculateDiscountedPrice: (price: number, promotion: any) => number | null;
}

export function TrendingSection({
  items,
  onItemClick,
  onQuickAdd,
  getItemPromotion,
  calculateDiscountedPrice,
}: TrendingSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Trending Now</h2>
            <p className="text-sm text-muted-foreground">Most ordered this week</p>
          </div>
        </div>
        <div className="hidden md:flex gap-2">
          <Button variant="outline" size="icon" onClick={() => scroll('left')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scroll('right')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, index) => {
            const itemImage = PlaceHolderImages.find(img => img.id === item.imageId);
            const promotion = getItemPromotion(item.id);
            const discountedPrice = promotion ? calculateDiscountedPrice(item.price, promotion) : null;
            const hasUploadedImage = item.imageUrl && item.imageUrl.startsWith('http');
            
            return (
              <Card
                key={item.id}
                className="flex-shrink-0 w-[280px] md:w-[320px] snap-start cursor-pointer group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/50"
                onClick={() => onItemClick(item)}
              >
                <div className="relative aspect-[4/3]">
                  {hasUploadedImage ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : itemImage ? (
                    <Image
                      src={itemImage.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  
                  {/* Ranking Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-lg font-bold px-3">
                      #{index + 1}
                    </Badge>
                  </div>

                  {/* Discount Badge */}
                  {promotion && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500 text-white border-0 animate-pulse">
                        {promotion.type === 'percentage' ? `${promotion.value}% OFF` : `₹${promotion.value} OFF`}
                      </Badge>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  {/* Quick Add Button */}
                  <Button
                    size="sm"
                    className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAdd(item);
                    }}
                  >
                    + Add
                  </Button>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <Badge variant="secondary" className="flex items-center gap-1 shrink-0">
                      <Flame className="h-3 w-3 text-orange-500" />
                      Hot
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{item.rating?.toFixed(1) || '4.5'}</span>
                      <span>({item.reviewCount || ((item.id.charCodeAt(0) % 100) + 50)})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{item.prepTime || 15}-{(item.prepTime || 15) + 5} min</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {discountedPrice !== null ? (
                      <div className="flex items-baseline gap-2">
                        <Price amount={discountedPrice} className="text-xl font-bold text-primary" />
                        <Price amount={item.price} className="text-sm text-muted-foreground line-through" />
                      </div>
                    ) : (
                      <Price amount={item.price} className="text-xl font-bold text-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
