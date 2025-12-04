'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, X, Sparkles } from 'lucide-react';
import type { Category, MenuItem } from '@/types';

interface FloatingCategoryNavProps {
  categories: Category[];
  menuItems: MenuItem[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  isVisible?: boolean;
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
  all: '✨',
};

export function FloatingCategoryNav({
  categories,
  menuItems,
  selectedCategory,
  onCategoryChange,
  isVisible = true,
}: FloatingCategoryNavProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const allCategories = [{ id: 'all', name: 'All Items' }, ...categories];
  const currentCategory = allCategories.find((c) => c.id === selectedCategory);

  const getItemCountForCategory = useCallback(
    (categoryId: string) => {
      if (categoryId === 'all') return menuItems.length;
      return menuItems.filter((item) => item.category === categoryId).length;
    },
    [menuItems]
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isExpanded) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.floating-nav-container')) {
          setIsExpanded(false);
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
    return () => {};
  }, [isExpanded]);

  const handleCategorySelect = (categoryId: string) => {
    onCategoryChange(categoryId);
    setIsExpanded(false);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed bottom-24 md:bottom-20 left-1/2 -translate-x-1/2 z-40 floating-nav-container"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 md:w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-border overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
          >
            <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  Jump to Category
                </span>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto">
              {allCategories.map((category, index) => {
                const isSelected = category.id === selectedCategory;
                const itemCount = getItemCountForCategory(category.id);
                const icon = categoryIcons[category.id] || '🍴';

                return (
                  <motion.button
                    key={category.id}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                      isSelected
                        ? 'bg-primary/10 border-l-4 border-primary'
                        : 'hover:bg-muted/50 border-l-4 border-transparent'
                    }`}
                    onClick={() => handleCategorySelect(category.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span className="text-2xl">{icon}</span>
                    <div className="flex-1 text-left">
                      <p
                        className={`font-medium ${
                          isSelected ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {category.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {itemCount} item{itemCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {isSelected && (
                      <motion.div
                        className="w-2 h-2 rounded-full bg-primary"
                        layoutId="categoryIndicator"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="relative flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 rounded-full shadow-lg border border-border hover:shadow-xl transition-shadow"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-9 h-9 -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="15"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-muted"
          />
          <motion.circle
            cx="18"
            cy="18"
            r="15"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            className="text-primary"
            strokeDasharray="94.2"
            strokeDashoffset={94.2 - (94.2 * scrollProgress) / 100}
          />
        </svg>

        <span className="absolute left-4 text-lg">
          {categoryIcons[selectedCategory] || '✨'}
        </span>

        <div className="flex items-center gap-2 pl-5">
          <span className="font-medium text-foreground whitespace-nowrap max-w-24 truncate">
            {currentCategory?.name || 'All Items'}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </div>
      </motion.button>
    </motion.div>
  );
}
