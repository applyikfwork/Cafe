'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { MenuItem, Tag, Review } from '@/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  X,
  Minus,
  Plus,
  Check,
  TrendingUp,
  Star,
  Flame,
  Leaf,
  ShieldCheck,
  Clock,
  Users,
  Award,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Price } from '@/components/ui/price';
import { DiscountBadge, Currency } from '@/components/ui/currency';
import { format } from 'date-fns';

type SizeVariant = 'S' | 'M' | 'L';

interface SwipeableItemPreviewProps {
  items: MenuItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (item: MenuItem, quantity: number, size?: SizeVariant) => void;
  onNavigate: (index: number) => void;
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

const sizeModifiers: Record<SizeVariant, { label: string; priceMultiplier: number }> = {
  S: { label: 'Small', priceMultiplier: 0.8 },
  M: { label: 'Medium', priceMultiplier: 1 },
  L: { label: 'Large', priceMultiplier: 1.3 },
};

export function SwipeableItemPreview({
  items,
  currentIndex,
  isOpen,
  onClose,
  onAddToCart,
  onNavigate,
  getItemPromotion,
  calculateDiscountedPrice,
}: SwipeableItemPreviewProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<SizeVariant>('M');
  const [added, setAdded] = useState(false);
  const [direction, setDirection] = useState(0);

  const item = items[currentIndex];

  useEffect(() => {
    setQuantity(1);
    setSelectedSize('M');
    setAdded(false);
  }, [currentIndex]);

  const handleDragEnd = useCallback(
    (_: any, info: PanInfo) => {
      const threshold = 100;
      if (info.offset.x > threshold && currentIndex > 0) {
        setDirection(-1);
        onNavigate(currentIndex - 1);
      } else if (info.offset.x < -threshold && currentIndex < items.length - 1) {
        setDirection(1);
        onNavigate(currentIndex + 1);
      }
    },
    [currentIndex, items.length, onNavigate]
  );

  const goToNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      setDirection(1);
      onNavigate(currentIndex + 1);
    }
  }, [currentIndex, items.length, onNavigate]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      onNavigate(currentIndex - 1);
    }
  }, [currentIndex, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToNext, goToPrev, onClose]);

  if (!item) return null;

  const itemImage = PlaceHolderImages.find((img) => img.id === item.imageId);
  const hasUploadedImage = item.imageUrl && item.imageUrl.startsWith('http');
  const promotion = getItemPromotion?.(item.id);
  const discountedPrice =
    promotion && calculateDiscountedPrice
      ? calculateDiscountedPrice(item.price, promotion)
      : null;

  const currentPrice = (discountedPrice || item.price) * sizeModifiers[selectedSize].priceMultiplier;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(item, quantity, selectedSize);
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuantity(1);
      if (currentIndex < items.length - 1) {
        goToNext();
      } else {
        onClose();
      }
    }, 1000);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full h-screen w-screen p-0 border-0 bg-background/95 backdrop-blur-sm md:max-h-[90vh] md:max-w-2xl md:rounded-lg overflow-hidden">
        <div className="absolute top-4 left-0 right-0 z-50 flex items-center justify-center gap-1.5 px-4">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                onNavigate(idx);
              }}
              className={`h-1 rounded-full transition-all ${
                idx === currentIndex
                  ? 'w-8 bg-primary'
                  : 'w-1.5 bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 rounded-full bg-black/50 hover:bg-black/70 p-2 transition-all"
        >
          <X className="h-6 w-6 text-white" />
        </button>

        {currentIndex > 0 && (
          <button
            onClick={goToPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {currentIndex < items.length - 1 && (
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={item.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="h-full"
          >
            <ScrollArea className="h-full w-full">
              <div className="relative pb-32">
                <div className="relative w-full aspect-square md:aspect-auto md:h-80 overflow-hidden bg-muted">
                  {hasUploadedImage ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  ) : itemImage ? (
                    <Image
                      src={itemImage.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-8xl">🍽️</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div>
                      {promotion && (
                        <Badge className="bg-red-500 text-white border-0 shadow-lg mb-2">
                          <DiscountBadge
                            type={promotion.type}
                            value={promotion.value}
                            suffix="OFF"
                          />
                        </Badge>
                      )}
                      {item.isTrending && (
                        <Badge className="bg-orange-500 text-white border-0 shadow-lg ml-2 mb-2">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <div className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                      {currentIndex + 1} / {items.length}
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h1 className="text-2xl md:text-3xl font-headline font-bold mb-2">
                    {item.name}
                  </h1>

                  <div className="flex gap-2 mb-4 flex-wrap">
                    {item.tags.map((tag) => {
                      const Icon = tagIcons[tag];
                      return (
                        <Badge
                          key={tag}
                          variant="outline"
                          className={`${tagColors[tag]}`}
                        >
                          <Icon className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      );
                    })}
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {item.rating && (
                      <div className="flex flex-col items-center p-2 bg-yellow-500/10 rounded-lg">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mb-1" />
                        <span className="font-bold text-sm">{item.rating.toFixed(1)}</span>
                        <span className="text-[10px] text-muted-foreground">Rating</span>
                      </div>
                    )}
                    {item.prepTime && (
                      <div className="flex flex-col items-center p-2 bg-blue-500/10 rounded-lg">
                        <Clock className="h-4 w-4 text-blue-500 mb-1" />
                        <span className="font-bold text-sm">{item.prepTime}m</span>
                        <span className="text-[10px] text-muted-foreground">Prep</span>
                      </div>
                    )}
                    {item.calories && (
                      <div className="flex flex-col items-center p-2 bg-orange-500/10 rounded-lg">
                        <Flame className="h-4 w-4 text-orange-500 mb-1" />
                        <span className="font-bold text-sm">{item.calories}</span>
                        <span className="text-[10px] text-muted-foreground">Cal</span>
                      </div>
                    )}
                    {item.totalBuyers && (
                      <div className="flex flex-col items-center p-2 bg-green-500/10 rounded-lg">
                        <Users className="h-4 w-4 text-green-500 mb-1" />
                        <span className="font-bold text-sm">{item.totalBuyers > 999 ? `${(item.totalBuyers/1000).toFixed(1)}k` : item.totalBuyers}</span>
                        <span className="text-[10px] text-muted-foreground">Sold</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <span className="text-sm font-medium mb-2 block">Select Size:</span>
                    <div className="flex gap-2">
                      {(['S', 'M', 'L'] as SizeVariant[]).map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                            selectedSize === size
                              ? 'bg-primary text-white shadow-lg scale-105'
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                        >
                          <span className="block text-lg">{size}</span>
                          <span className="block text-xs opacity-80">
                            {sizeModifiers[size].label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {item.reviews && item.reviews.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Reviews ({item.reviews.length})
                      </h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {item.reviews.slice(0, 2).map((review: Review) => (
                          <div
                            key={review.id}
                            className="p-3 bg-muted/50 rounded-lg text-sm"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                {review.reviewerName.charAt(0)}
                              </div>
                              <span className="font-medium">{review.reviewerName}</span>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-2.5 w-2.5 ${
                                      i < Math.floor(review.rating)
                                        ? 'text-yellow-500 fill-yellow-500'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground line-clamp-2">
                              {review.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.ingredients && item.ingredients.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Ingredients</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {item.ingredients.map((ing, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {ing}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <Price
                  amount={currentPrice}
                  className="text-2xl font-bold text-primary"
                />
                {discountedPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    <Price amount={item.price * sizeModifiers[selectedSize].priceMultiplier} />
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {sizeModifiers[selectedSize].label} size
              </span>
            </div>

            <div className="flex items-center border-2 rounded-xl bg-muted/50">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-10 w-10"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-3 font-bold text-lg">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                className="h-10 w-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={added}
            className={`w-full h-14 text-lg font-bold rounded-xl transition-all shadow-lg ${
              added
                ? 'bg-green-500 hover:bg-green-500'
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            <AnimatePresence mode="wait">
              {added ? (
                <motion.div
                  key="added"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check className="h-5 w-5" />
                  Added to Cart!
                </motion.div>
              ) : (
                <motion.div
                  key="add"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add {quantity} to Cart -{' '}
                  <Currency amount={Math.round(currentPrice * quantity)} />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-2">
            Swipe left/right to browse more items
          </p>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
