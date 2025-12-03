'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, List, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ViewMode = 'grid' | 'list';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({
  viewMode,
  onViewModeChange,
}: ViewModeToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 p-1 bg-muted/50 rounded-lg border border-border">
      <motion.div
        className="absolute h-8 bg-white dark:bg-gray-800 rounded-md shadow-sm"
        layoutId="viewModeIndicator"
        style={{
          width: viewMode === 'grid' ? 'calc(50% - 2px)' : 'calc(50% - 2px)',
          left: viewMode === 'grid' ? '4px' : 'calc(50% + 2px)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewModeChange('grid')}
        className={`relative z-10 flex items-center gap-2 h-8 px-3 transition-colors ${
          viewMode === 'grid'
            ? 'text-primary bg-white dark:bg-gray-800 shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">Grid</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewModeChange('list')}
        className={`relative z-10 flex items-center gap-2 h-8 px-3 transition-colors ${
          viewMode === 'list'
            ? 'text-primary bg-white dark:bg-gray-800 shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <List className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">List</span>
      </Button>
    </div>
  );
}
