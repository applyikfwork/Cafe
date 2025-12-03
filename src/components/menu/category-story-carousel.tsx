'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { Category, MenuItem } from '@/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryStoryCarouselProps {
  categories: Category[];
  menuItems: MenuItem[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const categoryIcons: Record<string, string> = {
  breakfast: '🌅',
  'main-courses': '🍽️',
  desserts: '🍰',
  drinks: '☕',
  coffee: '☕',
  tea: '🫖',
  pastry: '🥐',
  sandwich: '🥪',
  soup: '🍲',
  salad: '🥗',
};

const categoryGradients: Record<string, string> = {
  breakfast: 'from-amber-500 via-orange-400 to-yellow-500',
  'main-courses': 'from-rose-500 via-red-400 to-orange-500',
  desserts: 'from-pink-500 via-purple-400 to-fuchsia-500',
  drinks: 'from-cyan-500 via-blue-400 to-indigo-500',
  coffee: 'from-amber-700 via-orange-600 to-yellow-700',
  all: 'from-primary via-primary/80 to-primary',
};

export function CategoryStoryCarousel({
  categories,
  menuItems,
  selectedCategory,
  onCategoryChange,
}: CategoryStoryCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    skipSnaps: false,
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const allCategories = [{ id: 'all', name: 'All Items' }, ...categories];

  const getItemCountForCategory = useCallback(
    (categoryId: string) => {
      if (categoryId === 'all') return menuItems.length;
      return menuItems.filter((item) => item.category === categoryId).length;
    },
    [menuItems]
  );

  const getCategoryImage = useCallback(
    (categoryId: string) => {
      const items = categoryId === 'all' 
        ? menuItems 
        : menuItems.filter((item) => item.category === categoryId);
      
      if (items.length > 0) {
        const item = items[0];
        if (item.imageUrl && item.imageUrl.startsWith('http')) {
          return item.imageUrl;
        }
        const placeholder = PlaceHolderImages.find((img) => img.id === item.imageId);
        return placeholder?.imageUrl || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400';
      }
      return 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400';
    },
    [menuItems]
  );

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
      const category = allCategories[index];
      if (category) {
        onCategoryChange(category.id);
      }
    },
    [emblaApi, allCategories, onCategoryChange]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    setProgress(0);
    
    const category = allCategories[index];
    if (category && category.id !== selectedCategory) {
      onCategoryChange(category.id);
    }
  }, [emblaApi, allCategories, selectedCategory, onCategoryChange]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const currentIndex = allCategories.findIndex((c) => c.id === selectedCategory);
    if (currentIndex >= 0 && currentIndex !== selectedIndex) {
      emblaApi?.scrollTo(currentIndex);
    }
  }, [selectedCategory, allCategories, emblaApi, selectedIndex]);

  useEffect(() => {
    if (isAutoPlaying) {
      progressRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            const nextIndex = (selectedIndex + 1) % allCategories.length;
            scrollTo(nextIndex);
            return 0;
          }
          return prev + 2;
        });
      }, 100);

      return () => {
        if (progressRef.current) {
          clearInterval(progressRef.current);
        }
      };
    }
    return () => {};
  }, [isAutoPlaying, selectedIndex, allCategories.length, scrollTo]);

  const canScrollPrev = selectedIndex > 0;
  const canScrollNext = selectedIndex < allCategories.length - 1;

  return (
    <div className="relative w-full mb-6">
      <div className="flex items-center gap-1 mb-4 px-2">
        {allCategories.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-0.5 rounded-full bg-muted overflow-hidden cursor-pointer"
            onClick={() => scrollTo(index)}
          >
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{
                width:
                  index < selectedIndex
                    ? '100%'
                    : index === selectedIndex
                    ? `${progress}%`
                    : '0%',
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
        ))}
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {allCategories.map((category, index) => {
            const isSelected = index === selectedIndex;
            const itemCount = getItemCountForCategory(category.id);
            const gradient = categoryGradients[category.id] || categoryGradients.all;
            const icon = categoryIcons[category.id] || '🍴';
            const bgImage = getCategoryImage(category.id);

            return (
              <motion.div
                key={category.id}
                className="flex-shrink-0 w-[85%] sm:w-[45%] md:w-[30%] lg:w-[23%] px-2 first:pl-4 last:pr-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <motion.div
                  className={`relative h-40 sm:h-48 rounded-2xl overflow-hidden cursor-pointer group ${
                    isSelected ? 'ring-4 ring-primary ring-offset-2' : ''
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollTo(index)}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={bgImage}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 85vw, (max-width: 768px) 45vw, 30vw"
                    />
                  </div>

                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-70`}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-3xl">{icon}</span>
                      <motion.div
                        className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                      >
                        <span className="text-white text-sm font-medium">
                          {itemCount} items
                        </span>
                      </motion.div>
                    </div>

                    <div>
                      <h3 className="text-white text-xl font-bold mb-1 drop-shadow-lg">
                        {category.name}
                      </h3>
                      {isSelected && (
                        <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <span className="text-white/80 text-sm">Tap to explore</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          >
                            <ChevronRight className="w-4 h-4 text-white" />
                          </motion.div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {canScrollPrev && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-900 transition-colors"
            onClick={() => scrollTo(selectedIndex - 1)}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
        )}

        {canScrollNext && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-900 transition-colors"
            onClick={() => scrollTo(selectedIndex + 1)}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="flex justify-center gap-1.5 mt-4">
        {allCategories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => scrollTo(index)}
            className={`transition-all duration-300 ${
              index === selectedIndex
                ? 'w-6 h-2 bg-primary rounded-full'
                : 'w-2 h-2 bg-muted-foreground/30 rounded-full hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
