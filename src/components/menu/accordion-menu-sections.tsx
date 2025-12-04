'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Category, MenuItem } from '@/types';
import { ChevronDown, Grid3X3, List, Star, Clock, Flame, TrendingUp } from 'lucide-react';

interface AccordionMenuSectionsProps {
  categories: Category[];
  menuItems: MenuItem[];
  renderItem: (item: MenuItem, index: number) => React.ReactNode;
  viewMode: 'grid' | 'list';
  defaultExpanded?: string[];
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
};

const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  breakfast: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
  },
  'main-courses': {
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-800',
    text: 'text-rose-700 dark:text-rose-300',
  },
  desserts: {
    bg: 'bg-pink-50 dark:bg-pink-950/30',
    border: 'border-pink-200 dark:border-pink-800',
    text: 'text-pink-700 dark:text-pink-300',
  },
  drinks: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/30',
    border: 'border-cyan-200 dark:border-cyan-800',
    text: 'text-cyan-700 dark:text-cyan-300',
  },
};

export function AccordionMenuSections({
  categories,
  menuItems,
  renderItem,
  viewMode,
  defaultExpanded = [],
}: AccordionMenuSectionsProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(
    defaultExpanded.length > 0 ? defaultExpanded : categories.slice(0, 1).map((c) => c.id)
  );

  const getItemsForCategory = useCallback(
    (categoryId: string) => {
      return menuItems.filter((item) => 
        item.category === categoryId || 
        item.category?.toLowerCase() === categoryId?.toLowerCase() ||
        item.category?.toLowerCase().replace(/\s+/g, '-') === categoryId?.toLowerCase()
      );
    },
    [menuItems]
  );

  const uncategorizedItems = useMemo(() => {
    const categorizedItemIds = new Set<string>();
    categories.forEach(cat => {
      getItemsForCategory(cat.id).forEach(item => categorizedItemIds.add(item.id));
    });
    return menuItems.filter(item => !categorizedItemIds.has(item.id));
  }, [menuItems, categories, getItemsForCategory]);

  const getCategoryStats = useCallback(
    (categoryId: string) => {
      const items = getItemsForCategory(categoryId);
      const avgRating =
        items.reduce((sum, item) => sum + (item.rating || 4.5), 0) / items.length;
      const avgPrepTime =
        items.reduce((sum, item) => sum + (item.prepTime || 15), 0) / items.length;
      const trendingCount = items.filter((item) => item.isTrending).length;

      return {
        count: items.length,
        avgRating: avgRating.toFixed(1),
        avgPrepTime: Math.round(avgPrepTime),
        trendingCount,
      };
    },
    [getItemsForCategory]
  );

  return (
    <Accordion
      type="multiple"
      value={expandedSections}
      onValueChange={setExpandedSections}
      className="space-y-4"
    >
      {categories.map((category) => {
        const items = getItemsForCategory(category.id);
        const stats = getCategoryStats(category.id);
        const isExpanded = expandedSections.includes(category.id);
        const icon = categoryIcons[category.id] || '🍴';
        const colors = categoryColors[category.id] || {
          bg: 'bg-muted/30',
          border: 'border-border',
          text: 'text-foreground',
        };

        if (items.length === 0) return null;

        return (
          <AccordionItem
            key={category.id}
            value={category.id}
            className={`rounded-2xl border-2 ${colors.border} ${colors.bg} overflow-hidden transition-all duration-300`}
          >
            <AccordionTrigger className="px-4 md:px-5 lg:px-6 py-4 md:py-5 hover:no-underline group">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <motion.span
                    className="text-3xl"
                    animate={{ rotate: isExpanded ? 10 : 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {icon}
                  </motion.span>
                  <div className="text-left">
                    <h3 className={`text-lg font-bold ${colors.text}`}>
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {stats.avgRating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ~{stats.avgPrepTime} min
                      </span>
                      {stats.trendingCount > 0 && (
                        <span className="flex items-center gap-1 text-orange-500">
                          <TrendingUp className="w-3 h-3" />
                          {stats.trendingCount} trending
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <motion.div
                    className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm border border-border"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="font-semibold text-sm">
                      {stats.count} item{stats.count !== 1 ? 's' : ''}
                    </span>
                  </motion.div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-1.5 rounded-full bg-white/50 dark:bg-gray-800/50"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 md:px-5 lg:px-6 pb-4 md:pb-5">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6'
                    : 'space-y-3 md:space-y-4'
                }
              >
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {renderItem(item, index)}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </AccordionContent>
          </AccordionItem>
        );
      })}

      {/* Show uncategorized items if any exist */}
      {uncategorizedItems.length > 0 && (
        <AccordionItem
          value="uncategorized"
          className="rounded-2xl border-2 border-primary/30 bg-primary/5 overflow-hidden transition-all duration-300"
        >
          <AccordionTrigger className="px-4 md:px-5 lg:px-6 py-4 md:py-5 hover:no-underline group">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <motion.span
                  className="text-3xl"
                  animate={{ rotate: expandedSections.includes('uncategorized') ? 10 : 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  ✨
                </motion.span>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-primary">
                    All Menu Items
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      Featured
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <motion.div
                  className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm border border-border"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="font-semibold text-sm">
                    {uncategorizedItems.length} item{uncategorizedItems.length !== 1 ? 's' : ''}
                  </span>
                </motion.div>
                <motion.div
                  animate={{ rotate: expandedSections.includes('uncategorized') ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-1.5 rounded-full bg-white/50 dark:bg-gray-800/50"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-4 md:px-5 lg:px-6 pb-4 md:pb-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6'
                  : 'space-y-3 md:space-y-4'
              }
            >
              <AnimatePresence mode="popLayout">
                {uncategorizedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {renderItem(item, index)}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}
