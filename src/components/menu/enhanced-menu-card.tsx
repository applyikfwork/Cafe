'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Price } from '@/components/ui/price';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { 
  Star, 
  Clock, 
  Plus, 
  Heart, 
  Flame, 
  Leaf, 
  ShieldCheck, 
  Sparkles,
  TrendingUp,
  ImageIcon
} from 'lucide-react';
import type { MenuItem, Tag } from '@/types';

interface EnhancedMenuCardProps {
  item: MenuItem;
  index: number;
  isFavorite: boolean;
  promotion: any;
  discountedPrice: number | null;
  onItemClick: () => void;
  onQuickAdd: () => void;
  onToggleFavorite: () => void;
}

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

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function EnhancedMenuCard({
  item,
  index,
  isFavorite,
  promotion,
  discountedPrice,
  onItemClick,
  onQuickAdd,
  onToggleFavorite,
}: EnhancedMenuCardProps) {
  const itemImage = PlaceHolderImages.find(img => img.id === item.imageId);
  const hasUploadedImage = item.imageUrl && item.imageUrl.startsWith('http');
  const rating = item.rating || 4.5;
  const hash = hashCode(item.id);
  const reviewCount = item.reviewCount || (hash % 100) + 50;
  const prepTime = item.prepTime || 15;
  const orderCount = item.orderCount || (hash % 500) + 100;

  return (
    <ScrollReveal direction="up" delay={index * 0.05}>
      <Card
        className="group relative flex flex-col h-full hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 overflow-hidden bg-card/50 backdrop-blur-sm cursor-pointer"
        onClick={onItemClick}
      >
        {/* Badges Section */}
        <div className="absolute top-3 left-3 right-3 z-10 flex justify-between">
          <div className="flex gap-2">
            {item.tags.includes('new' as Tag) && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-lg">
                <Star className="h-3 w-3 mr-1" />
                NEW
              </Badge>
            )}
            {item.isPopular && (
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
                <TrendingUp className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
          </div>
          
          {/* Favorite Button */}
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/90 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-pink-500 text-pink-500' : 'text-gray-600'}`} />
          </Button>
        </div>

        {/* Discount Badge */}
        {promotion && promotion.type && promotion.value !== undefined && (
          <div className="absolute top-14 right-3 z-10">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg animate-pulse">
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

            {/* Quick Add Button on Image */}
            <Button
              size="sm"
              className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all bg-primary hover:bg-primary/90 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd();
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Quick Add
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-5 flex flex-col flex-1">
          {/* Title */}
          <h3 className="font-headline text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {item.name}
          </h3>

          {/* Rating, Reviews, Prep Time Row */}
          <div className="flex items-center gap-3 mb-3 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({reviewCount})</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{prepTime}-{prepTime + 5} min</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm flex-grow leading-relaxed line-clamp-2 mb-3">
            {item.description}
          </p>

          {/* Tags */}
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

          {/* Price and Order Count */}
          <div className="flex justify-between items-end mt-auto pt-3 border-t">
            <div className="flex flex-col">
              {discountedPrice !== null ? (
                <>
                  <span className="text-sm text-muted-foreground line-through">
                    <Price amount={item.price} />
                  </span>
                  <Price amount={discountedPrice} className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent" />
                </>
              ) : (
                <Price amount={item.price} className="text-2xl font-bold text-primary" />
              )}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {orderCount}+ ordered
            </div>
          </div>
        </CardContent>
      </Card>
    </ScrollReveal>
  );
}
