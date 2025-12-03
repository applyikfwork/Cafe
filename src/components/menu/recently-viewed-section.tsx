'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Price } from '@/components/ui/price';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Clock, Star, X, History, ImageIcon } from 'lucide-react';
import type { MenuItem } from '@/types';

interface RecentlyViewedSectionProps {
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
  onClear: () => void;
}

export function RecentlyViewedSection({
  items,
  onItemClick,
  onClear,
}: RecentlyViewedSectionProps) {
  if (items.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
            <History className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Recently Viewed</h2>
            <p className="text-sm text-muted-foreground">Continue where you left off</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      <div 
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => {
          const itemImage = PlaceHolderImages.find(img => img.id === item.imageId);
          const hasUploadedImage = item.imageUrl && item.imageUrl.startsWith('http');
          
          return (
            <Card
              key={item.id}
              className="flex-shrink-0 w-[200px] cursor-pointer group hover:shadow-lg transition-all duration-300 overflow-hidden"
              onClick={() => onItemClick(item)}
            >
              <div className="relative aspect-square">
                {hasUploadedImage ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : itemImage ? (
                  <Image
                    src={itemImage.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <CardContent className="p-3">
                <h4 className="font-semibold text-sm line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                  {item.name}
                </h4>
                <div className="flex items-center justify-between">
                  <Price amount={item.price} className="font-bold text-primary" />
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {item.rating?.toFixed(1) || '4.5'}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
