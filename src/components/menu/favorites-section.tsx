'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Price } from '@/components/ui/price';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Heart, Star, Clock, Plus, ImageIcon } from 'lucide-react';
import type { MenuItem } from '@/types';

interface FavoritesSectionProps {
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
  onRemoveFavorite: (itemId: string) => void;
}

export function FavoritesSection({
  items,
  onItemClick,
  onQuickAdd,
  onRemoveFavorite,
}: FavoritesSectionProps) {
  if (items.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
            <Heart className="h-5 w-5 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Your Favorites</h2>
            <p className="text-sm text-muted-foreground">{items.length} saved items</p>
          </div>
        </div>
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
              className="flex-shrink-0 w-[260px] cursor-pointer group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-pink-200 dark:border-pink-500/20"
              onClick={() => onItemClick(item)}
            >
              <div className="relative aspect-[4/3]">
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
                    <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
                
                {/* Favorite Heart */}
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavorite(item.id);
                  }}
                >
                  <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
                </Button>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Quick Add */}
                <Button
                  size="sm"
                  className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAdd(item);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              <CardContent className="p-4">
                <h4 className="font-bold line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                  {item.name}
                </h4>
                <div className="flex items-center justify-between">
                  <Price amount={item.price} className="font-bold text-lg text-primary" />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {item.rating?.toFixed(1) || '4.5'}
                    </div>
                    <span className="text-muted-foreground/50">|</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {item.prepTime || 15}m
                    </div>
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
