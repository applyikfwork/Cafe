'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Price } from '@/components/ui/price';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Sparkles, Star, Clock, Plus, ImageIcon } from 'lucide-react';
import type { MenuItem } from '@/types';

interface RecommendedSectionProps {
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

export function RecommendedSection({
  items,
  onItemClick,
  onQuickAdd,
}: RecommendedSectionProps) {
  if (items.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Recommended For You</h2>
            <p className="text-sm text-muted-foreground">Based on your preferences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.slice(0, 6).map((item) => {
          const itemImage = PlaceHolderImages.find(img => img.id === item.imageId);
          const hasUploadedImage = item.imageUrl && item.imageUrl.startsWith('http');
          
          return (
            <Card
              key={item.id}
              className="cursor-pointer group hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-row h-[140px]"
              onClick={() => onItemClick(item)}
            >
              <div className="relative w-[140px] flex-shrink-0">
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
                    <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                )}
                <Badge className="absolute top-2 left-2 bg-purple-500 text-white border-0 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  For You
                </Badge>
              </div>

              <CardContent className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="font-bold line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <Price amount={item.price} className="font-bold text-primary" />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {item.rating?.toFixed(1) || '4.5'}
                      </div>
                      <span>·</span>
                      <div className="flex items-center gap-0.5">
                        <Clock className="h-3 w-3" />
                        {item.prepTime || 15}m
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAdd(item);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
