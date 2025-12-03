'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Price } from '@/components/ui/price';
import { DiscountBadge } from '@/components/ui/currency';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Star,
  Clock,
  Plus,
  Heart,
  Flame,
  Leaf,
  ShieldCheck,
  Sparkles,
  Check,
  Minus,
} from 'lucide-react';
import type { MenuItem, Tag } from '@/types';

type SizeVariant = 'S' | 'M' | 'L';

interface MenuItemListCardProps {
  item: MenuItem;
  index: number;
  isFavorite: boolean;
  promotion: any;
  discountedPrice: number | null;
  onItemClick: () => void;
  onQuickAdd: (size?: SizeVariant) => void;
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

const sizeModifiers: Record<SizeVariant, { label: string; priceMultiplier: number }> = {
  S: { label: 'Small', priceMultiplier: 0.8 },
  M: { label: 'Medium', priceMultiplier: 1 },
  L: { label: 'Large', priceMultiplier: 1.3 },
};

export function MenuItemListCard({
  item,
  index,
  isFavorite,
  promotion,
  discountedPrice,
  onItemClick,
  onQuickAdd,
  onToggleFavorite,
}: MenuItemListCardProps) {
  const [selectedSize, setSelectedSize] = useState<SizeVariant>('M');
  const [showSizes, setShowSizes] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const itemImage = PlaceHolderImages.find((img) => img.id === item.imageId);
  const hasUploadedImage = item.imageUrl && item.imageUrl.startsWith('http');
  const rating = item.rating || 4.5;
  const prepTime = item.prepTime || 15;

  const currentPrice = (discountedPrice || item.price) * sizeModifiers[selectedSize].priceMultiplier;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdded(true);
    onQuickAdd(selectedSize);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleSizeSelect = (size: SizeVariant, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSize(size);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 4 }}
    >
      <Card
        className="group relative flex overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30 cursor-pointer bg-card/50 backdrop-blur-sm"
        onClick={onItemClick}
      >
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
          {hasUploadedImage ? (
            <Image
              src={item.imageUrl!}
              alt={item.name}
              fill
              className="object-cover"
              sizes="128px"
            />
          ) : itemImage ? (
            <Image
              src={itemImage.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="128px"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-3xl">🍽️</span>
            </div>
          )}

          {promotion && (
            <div className="absolute top-1 left-1">
              <DiscountBadge
                type={promotion.type}
                value={promotion.value}
                suffix="OFF"
                className="text-[10px] px-1.5 py-0.5"
              />
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`absolute top-1 right-1 p-1.5 rounded-full transition-all ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-black/30 text-white hover:bg-black/50'
            }`}
          >
            <Heart className={`w-3 h-3 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{rating.toFixed(1)}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {item.description}
            </p>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {item.tags.slice(0, 2).map((tag) => {
                const Icon = tagIcons[tag];
                return (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={`${tagColors[tag]} text-[10px] px-1.5 py-0`}
                  >
                    <Icon className="w-2.5 h-2.5 mr-0.5" />
                    {tag}
                  </Badge>
                );
              })}
              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />
                {prepTime} min
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 gap-2">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <Price
                  amount={currentPrice}
                  className="font-bold text-sm sm:text-base text-primary"
                />
                {discountedPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    <Price amount={item.price * sizeModifiers[selectedSize].priceMultiplier} />
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1 mt-1">
                {(['S', 'M', 'L'] as SizeVariant[]).map((size) => (
                  <button
                    key={size}
                    onClick={(e) => handleSizeSelect(size, e)}
                    className={`w-6 h-6 text-[10px] font-bold rounded-full transition-all ${
                      selectedSize === size
                        ? 'bg-primary text-white scale-110'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              onClick={handleQuickAdd}
              className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all ${
                isAdded
                  ? 'bg-green-500 text-white'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="plus"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Plus className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
