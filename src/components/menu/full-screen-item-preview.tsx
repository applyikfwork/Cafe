'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { MenuItem, Tag } from '@/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { X, Minus, Plus, Check, TrendingUp, Star, Flame, Leaf, ShieldCheck } from 'lucide-react';
import { RupeeSymbol } from '@/components/ui/rupee-symbol';

interface FullScreenItemPreviewProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (item: MenuItem, quantity: number) => void;
  promotion?: any;
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

export function FullScreenItemPreview({
  item,
  isOpen,
  onClose,
  onAddToCart,
  promotion,
  calculateDiscountedPrice,
}: FullScreenItemPreviewProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!item) return null;

  const itemImage = PlaceHolderImages.find((img) => img.id === item.imageId);
  const hasUploadedImage = item.imageUrl && item.imageUrl.startsWith('http');
  const discountedPrice = promotion && calculateDiscountedPrice 
    ? calculateDiscountedPrice(item.price, promotion) 
    : null;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(item, quantity);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    setTimeout(() => {
      setQuantity(1);
      onClose();
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full h-screen w-screen p-0 border-0 bg-background/95 backdrop-blur-sm md:max-h-[90vh] md:max-w-2xl md:rounded-lg">
        <ScrollArea className="h-full w-full">
          <div className="relative">
            {/* Hero Image */}
            <div className="relative w-full aspect-square md:aspect-auto md:h-96 overflow-hidden bg-muted">
              {hasUploadedImage ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : itemImage ? (
                <Image
                  src={itemImage.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  data-ai-hint={itemImage.imageHint}
                />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {/* Badges */}
              <div className="absolute top-4 left-4 right-4 flex gap-2 flex-wrap">
                {promotion && promotion.type && promotion.value !== undefined && (
                  <Badge className="bg-red-500 text-white border-0 shadow-lg">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {promotion.type === 'percentage' ? `${promotion.value}% OFF` : `₹${promotion.value} OFF`}
                  </Badge>
                )}
                {item.tags.includes('new' as Tag) && (
                  <Badge className="bg-yellow-500 text-white border-0 shadow-lg">
                    <Star className="h-3 w-3 mr-1" />
                    NEW
                  </Badge>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/70 p-2 transition-all"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-headline font-bold mb-2">
                {item.name}
              </h1>

              {/* Tags */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {item.tags.map((tag) => {
                  const Icon = tagIcons[tag];
                  return (
                    <Badge
                      key={tag}
                      variant="outline"
                      className={`${tagColors[tag]} text-sm`}
                    >
                      <Icon className="h-3.5 w-3.5 mr-1.5" />
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </Badge>
                  );
                })}
              </div>

              {/* Description */}
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {item.description}
              </p>

              {/* Ingredients */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-headline font-semibold text-lg mb-3">Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.ingredients.map((ingredient, idx) => (
                      <Badge key={idx} variant="secondary">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Section */}
              <div className="mb-6 p-4 bg-card/50 rounded-lg border-2 border-primary/20">
                <div className="flex items-baseline gap-3">
                  {discountedPrice !== null ? (
                    <>
                      <span className="text-2xl md:text-3xl font-bold text-primary">
                        ₹{Math.round(discountedPrice)}
                      </span>
                      <span className="text-lg text-muted-foreground line-through">
                        ₹{item.price}
                      </span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400 ml-auto">
                        Save ₹{Math.round(item.price - discountedPrice)}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl md:text-4xl font-bold text-primary">
                      ₹{item.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Control */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center border-2 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-none"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 font-bold text-lg w-12 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="rounded-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                {added ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Added to Order!
                  </>
                ) : (
                  `Add to Order (₹${discountedPrice ? Math.round(discountedPrice * quantity) : item.price * quantity})`
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Tap to close or swipe down on mobile
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
