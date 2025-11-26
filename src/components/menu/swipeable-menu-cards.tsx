'use client';

import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MenuItem, Tag } from '@/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { TrendingUp, Star, Flame, Leaf, ShieldCheck } from 'lucide-react';

interface SwipeableMenuCardsProps {
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
  getItemPromotion?: (itemId: string) => any;
  calculateDiscountedPrice?: (price: number, promotion: any) => number | null;
}

const tagIcons: Record<Tag, any> = {
  veg: Leaf,
  spicy: Flame,
  'gluten-free': ShieldCheck,
  new: Star,
};

const tagColors: Record<Tag, string> = {
  veg: 'border-green-500/80 bg-green-500/10 text-green-700 dark:text-green-400',
  spicy: 'border-red-500/80 bg-red-500/10 text-red-700 dark:text-red-400',
  'gluten-free': 'border-blue-500/80 bg-blue-500/10 text-blue-700 dark:text-blue-400',
  new: 'border-yellow-500/80 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
};

export function SwipeableMenuCards({
  items,
  onItemClick,
  getItemPromotion,
  calculateDiscountedPrice,
}: SwipeableMenuCardsProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  useEffect(() => {
    if (!emblaApi) return;

    const updateScroll = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on('select', updateScroll);
    updateScroll();

    return () => {
      emblaApi.off('select', updateScroll);
    };
  }, [emblaApi]);

  if (items.length === 0) return null;

  return (
    <div className="w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 py-2">
          {items.map((item) => {
            const itemImage = PlaceHolderImages.find((img) => img.id === item.imageId);
            const hasUploadedImage = item.imageUrl && item.imageUrl.startsWith('http');
            const promotion = getItemPromotion ? getItemPromotion(item.id) : null;
            const discountedPrice = promotion && calculateDiscountedPrice 
              ? calculateDiscountedPrice(item.price, promotion) 
              : null;

            return (
              <div
                key={item.id}
                className="min-w-0 flex-[0_0_calc(100%/2.5)] sm:flex-[0_0_calc(100%/3)] md:flex-[0_0_calc(100%/4)]"
              >
                <Card
                  className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 overflow-hidden bg-card/50 backdrop-blur-sm group"
                  onClick={() => onItemClick(item)}
                >
                  <div className="relative overflow-hidden aspect-square">
                    {hasUploadedImage ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                      />
                    ) : itemImage ? (
                      <Image
                        src={itemImage.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-110"
                        data-ai-hint={itemImage.imageHint}
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {promotion && promotion.type && promotion.value !== undefined && (
                      <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-red-500 text-white text-xs border-0 shadow-lg animate-pulse">
                          <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                          {promotion.type === 'percentage' ? `${promotion.value}%` : `₹${promotion.value}`}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-3">
                    <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                      {item.description}
                    </p>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {item.tags.slice(0, 2).map((tag) => {
                        const Icon = tagIcons[tag];
                        return (
                          <Badge
                            key={tag}
                            variant="outline"
                            className={`text-xs ${tagColors[tag]}`}
                          >
                            <Icon className="h-2.5 w-2.5" />
                          </Badge>
                        );
                      })}
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <div>
                        {discountedPrice !== null ? (
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground line-through">₹{item.price}</span>
                            <span className="font-bold text-sm text-primary">₹{Math.round(discountedPrice)}</span>
                          </div>
                        ) : (
                          <span className="font-bold text-sm text-primary">₹{item.price}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
