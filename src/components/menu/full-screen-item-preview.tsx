'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { MenuItem, Tag, Review } from '@/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { X, Minus, Plus, Check, TrendingUp, Star, Flame, Leaf, ShieldCheck, Clock, Users, Award, ThumbsUp } from 'lucide-react';
import { Price } from '@/components/ui/price';
import { DiscountBadge, Currency } from '@/components/ui/currency';
import { format } from 'date-fns';

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
                    <DiscountBadge type={promotion.type} value={promotion.value} suffix="OFF" />
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

              {/* Social Proof Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {item.rating && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <div>
                      <p className="font-bold text-lg">{item.rating.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">{item.reviewCount || 0} reviews</p>
                    </div>
                  </div>
                )}
                {item.prepTime && (
                  <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-bold text-lg">{item.prepTime} min</p>
                      <p className="text-xs text-muted-foreground">Prep time</p>
                    </div>
                  </div>
                )}
                {item.calories && (
                  <div className="flex items-center gap-2 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-bold text-lg">{item.calories}</p>
                      <p className="text-xs text-muted-foreground">Calories</p>
                    </div>
                  </div>
                )}
                {item.totalBuyers && (
                  <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <Users className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-bold text-lg">{item.totalBuyers.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Happy buyers</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Badges for special items */}
              {(item.isPopular || item.isTrending || item.isBestSeller) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.isBestSeller && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0">
                      <Award className="h-3 w-3 mr-1" />
                      Best Seller
                    </Badge>
                  )}
                  {item.isTrending && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  {item.isPopular && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                      <Star className="h-3 w-3 mr-1" />
                      Popular Choice
                    </Badge>
                  )}
                </div>
              )}

              {/* Customer Reviews */}
              {item.reviews && item.reviews.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-headline font-semibold text-lg mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Customer Reviews
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {item.reviews.slice(0, 3).map((review: Review) => (
                      <div key={review.id} className="p-4 bg-muted/50 rounded-lg border">
                        <div className="flex items-center gap-3 mb-2">
                          {review.reviewerAvatar ? (
                            <img
                              src={review.reviewerAvatar}
                              alt={review.reviewerName}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="font-bold text-primary">
                                {review.reviewerName.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{review.reviewerName}</span>
                              {review.isVerified && (
                                <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                                  <Check className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => {
                                const fullStars = Math.floor(review.rating);
                                const hasHalfStar = review.rating % 1 >= 0.5;
                                const isFull = i < fullStars;
                                const isHalf = i === fullStars && hasHalfStar;
                                return (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      isFull
                                        ? 'text-yellow-500 fill-yellow-500'
                                        : isHalf
                                        ? 'text-yellow-500 fill-yellow-500/50'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                );
                              })}
                              <span className="text-xs text-muted-foreground ml-2">
                                {review.date ? format(new Date(review.date), 'MMM d, yyyy') : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                        {review.helpful && review.helpful > 0 && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <ThumbsUp className="h-3 w-3" />
                            {review.helpful} found this helpful
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                      <Price amount={Math.round(discountedPrice)} className="text-2xl md:text-3xl font-bold text-primary" />
                      <span className="text-lg text-muted-foreground line-through">
                        <Price amount={item.price} />
                      </span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400 ml-auto">
                        Save <Price amount={Math.round(item.price - discountedPrice)} />
                      </span>
                    </>
                  ) : (
                    <Price amount={item.price} className="text-3xl md:text-4xl font-bold text-primary" />
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
                  <>Add to Order (<Currency amount={discountedPrice ? Math.round(discountedPrice * quantity) : item.price * quantity} />)</>
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
