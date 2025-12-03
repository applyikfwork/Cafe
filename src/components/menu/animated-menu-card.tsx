'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
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
  TrendingUp,
  Check,
  Users,
} from 'lucide-react';
import type { MenuItem, Tag } from '@/types';

type SizeVariant = 'S' | 'M' | 'L';

interface AnimatedMenuCardProps {
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

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function AnimatedMenuCard({
  item,
  index,
  isFavorite,
  promotion,
  discountedPrice,
  onItemClick,
  onQuickAdd,
  onToggleFavorite,
}: AnimatedMenuCardProps) {
  const [selectedSize, setSelectedSize] = useState<SizeVariant>('M');
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const itemImage = PlaceHolderImages.find((img) => img.id === item.imageId);
  const hasUploadedImage = item.imageUrl && item.imageUrl.startsWith('http');
  const rating = item.rating || 4.5;
  const hash = hashCode(item.id);
  const reviewCount = item.reviewCount || (hash % 100) + 50;
  const prepTime = item.prepTime || 15;
  const orderCount = item.orderCount || (hash % 500) + 100;

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

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
        delay: index * 0.08,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className="group relative flex flex-col h-full overflow-hidden cursor-pointer bg-card/80 backdrop-blur-sm border-2 transition-all duration-500 hover:shadow-2xl hover:border-primary/40"
        onClick={onItemClick}
      >
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.5 }}
          >
            {hasUploadedImage ? (
              <Image
                src={item.imageUrl!}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : itemImage ? (
              <Image
                src={itemImage.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-6xl">🍽️</span>
              </div>
            )}
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <div className="flex flex-col gap-1.5">
              {promotion && (
                <DiscountBadge
                  type={promotion.type}
                  value={promotion.value}
                  suffix="OFF"
                  className="shadow-lg"
                />
              )}
              {item.isTrending && (
                <Badge className="bg-orange-500 text-white border-0 shadow-lg">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              )}
              {item.isBestSeller && (
                <Badge className="bg-yellow-500 text-black border-0 shadow-lg">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Best Seller
                </Badge>
              )}
            </div>

            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className={`p-2.5 rounded-full shadow-lg transition-all ${
                isFavorite
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 dark:bg-gray-900/90 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </motion.button>
          </div>

          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            {item.tags.slice(0, 2).map((tag) => {
              const Icon = tagIcons[tag];
              return (
                <Badge
                  key={tag}
                  variant="outline"
                  className={`${tagColors[tag]} backdrop-blur-sm bg-opacity-90 shadow-sm`}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              );
            })}
          </div>
        </div>

        <CardContent className="flex-1 p-4 flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {item.name}
              </h3>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {item.description}
            </p>

            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rating.toFixed(1)}</span>
                <span>({reviewCount})</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {prepTime} min
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {orderCount}+
              </span>
            </div>

            <div className="flex items-center gap-1.5 mb-3" onClick={(e) => e.stopPropagation()}>
              <span className="text-xs text-muted-foreground mr-1">Size:</span>
              {(['S', 'M', 'L'] as SizeVariant[]).map((size) => (
                <motion.button
                  key={size}
                  onClick={(e) => handleSizeSelect(size, e)}
                  className={`w-8 h-8 text-xs font-bold rounded-full transition-all ${
                    selectedSize === size
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {size}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <Price
                  amount={currentPrice}
                  className="font-bold text-xl text-primary"
                />
                {discountedPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    <Price amount={item.price * sizeModifiers[selectedSize].priceMultiplier} />
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {sizeModifiers[selectedSize].label}
              </span>
            </div>

            <motion.button
              onClick={handleQuickAdd}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-all shadow-lg ${
                isAdded
                  ? 'bg-green-500 text-white'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    className="flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Added!</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="add"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Add</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
