'use client';

import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MenuItem, Tag } from '@/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Star, Heart, TrendingUp } from 'lucide-react';
import { RupeeSymbol } from '@/components/ui/rupee-symbol';

interface FeaturedCarouselProps {
  items: MenuItem[];
  onItemClick?: (item: MenuItem) => void;
}

export function FeaturedCarousel({ items, onItemClick }: FeaturedCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', () => setSelectedIndex(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  if (items.length === 0) return null;

  return (
    <div className="w-full space-y-4">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 py-2">
          {items.map((item) => {
            const itemImage = PlaceHolderImages.find((img) => img.id === item.imageId);
            const hasUploadedImage = item.imageUrl && item.imageUrl.startsWith('http');

            return (
              <div
                key={item.id}
                className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%]"
              >
                <Card
                  className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 overflow-hidden bg-card/50 backdrop-blur-sm group relative"
                  onClick={() => onItemClick?.(item)}
                >
                  <div className="relative aspect-video overflow-hidden">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    <div className="absolute top-3 left-3 flex gap-2">
                      {item.tags.includes('new' as Tag) && (
                        <Badge className="bg-yellow-500 text-white border-0 shadow-lg">
                          <Star className="h-3 w-3 mr-1" />
                          NEW
                        </Badge>
                      )}
                    </div>

                    <button
                      className="absolute top-3 right-3 rounded-full bg-white/20 hover:bg-white/40 p-2 transition-all backdrop-blur"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Heart className="h-5 w-5 text-white" />
                    </button>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-primary"><RupeeSymbol />{item.price}</span>
                      <div className="flex items-center gap-1 bg-orange-500/20 px-2 py-1 rounded-full text-xs font-semibold text-orange-600 dark:text-orange-400">
                        <TrendingUp className="h-3 w-3" />
                        Popular
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="flex justify-center gap-2 py-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === selectedIndex ? 'bg-primary w-8' : 'bg-primary/30 w-2'
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
