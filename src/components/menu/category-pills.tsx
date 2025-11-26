'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Category } from '@/types';

interface CategoryPillsProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const categoryIcons: Record<string, string> = {
  coffee: '☕',
  tea: '🫖',
  pastry: '🥐',
  sandwich: '🥪',
  dessert: '🍰',
  drink: '🥤',
  soup: '🍲',
  salad: '🥗',
  pizza: '🍕',
  burger: '🍔',
};

export function CategoryPills({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryPillsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative w-full">
      {canScrollLeft && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur hover:bg-background"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-4 sm:px-0"
      >
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          className={`flex-shrink-0 transition-all ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-primary to-primary/80 text-white'
              : ''
          }`}
          onClick={() => onCategoryChange('all')}
        >
          All Items
        </Button>

        {categories.map((category) => {
          const icon = categoryIcons[category.name.toLowerCase()] || '🍽️';
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              className={`flex-shrink-0 transition-all whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-white'
                  : ''
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              <span className="mr-2">{icon}</span>
              {category.name}
            </Button>
          );
        })}
      </div>

      {canScrollRight && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur hover:bg-background"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
