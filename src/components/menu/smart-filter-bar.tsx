'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { 
  SlidersHorizontal, 
  ArrowUpDown,
  Leaf,
  Flame,
  X,
  Check
} from 'lucide-react';
import type { SortOption, SpiceLevel, DietaryPreference } from '@/types';
import { Price } from '@/components/ui/price';

interface SmartFilterBarProps {
  priceRange: [number, number];
  maxPrice: number;
  onPriceRangeChange: (range: [number, number]) => void;
  selectedDietary: DietaryPreference[];
  onDietaryChange: (dietary: DietaryPreference[]) => void;
  selectedSpiceLevel: SpiceLevel | null;
  onSpiceLevelChange: (level: SpiceLevel | null) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

const dietaryOptions: { value: DietaryPreference; label: string; icon: any }[] = [
  { value: 'veg', label: 'Vegetarian', icon: Leaf },
  { value: 'vegan', label: 'Vegan', icon: Leaf },
  { value: 'gluten-free', label: 'Gluten Free', icon: Check },
  { value: 'dairy-free', label: 'Dairy Free', icon: Check },
  { value: 'nut-free', label: 'Nut Free', icon: Check },
];

const spiceLevelOptions: { value: SpiceLevel; label: string; color: string }[] = [
  { value: 'mild', label: 'Mild', color: 'bg-green-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'hot', label: 'Hot', color: 'bg-orange-500' },
  { value: 'extra-hot', label: 'Extra Hot', color: 'bg-red-500' },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

export function SmartFilterBar({
  priceRange,
  maxPrice,
  onPriceRangeChange,
  selectedDietary,
  onDietaryChange,
  selectedSpiceLevel,
  onSpiceLevelChange,
  sortOption,
  onSortChange,
  onClearFilters,
  activeFilterCount,
}: SmartFilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDietary = (value: DietaryPreference) => {
    if (selectedDietary.includes(value)) {
      onDietaryChange(selectedDietary.filter(d => d !== value));
    } else {
      onDietaryChange([...selectedDietary, value]);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      {/* Clear All Button - Always visible when filters active */}
      {activeFilterCount > 0 && (
        <Button
          variant="destructive"
          size="sm"
          onClick={onClearFilters}
          className="h-9 px-3 gap-1"
        >
          <X className="h-4 w-4" />
          Clear All
        </Button>
      )}

      {/* Sort Dropdown */}
      <Select value={sortOption} onValueChange={(value) => onSortChange(value as SortOption)}>
        <SelectTrigger className="w-[160px] md:w-[180px] bg-card/50 backdrop-blur-sm border-2 h-9">
          <ArrowUpDown className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Filter Sheet Trigger */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="relative bg-card/50 backdrop-blur-sm border-2 h-9">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">More Filters</span>
            <span className="sm:hidden">Filters</span>
            {activeFilterCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-white text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[340px] sm:w-[400px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={onClearFilters}>
                  Clear All
                </Button>
              )}
            </SheetTitle>
            <SheetDescription>
              Customize your menu browsing experience
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-8">
            {/* Price Range Slider */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center justify-between">
                Price Range
                <span className="text-sm text-muted-foreground font-normal">
                  <Price amount={priceRange[0]} /> - <Price amount={priceRange[1]} />
                </span>
              </h4>
              <Slider
                value={priceRange}
                onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                max={maxPrice}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span><Price amount={0} /></span>
                <span><Price amount={maxPrice} /></span>
              </div>
            </div>

            {/* Dietary Preferences */}
            <div>
              <h4 className="font-semibold mb-4">Dietary Preferences</h4>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedDietary.includes(option.value);
                  return (
                    <Button
                      key={option.value}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleDietary(option.value)}
                      className={`transition-all ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Spice Level */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                Spice Level
              </h4>
              <div className="flex flex-wrap gap-2">
                {spiceLevelOptions.map((option) => {
                  const isSelected = selectedSpiceLevel === option.value;
                  return (
                    <Button
                      key={option.value}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => onSpiceLevelChange(isSelected ? null : option.value)}
                      className={`transition-all ${isSelected ? 'ring-2 ring-offset-2' : ''}`}
                    >
                      <span className={`w-3 h-3 rounded-full ${option.color} mr-2`} />
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <Button 
              className="w-full" 
              onClick={() => setIsOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Quick Dietary Filters - Visible on larger screens */}
      <div className="hidden md:flex items-center gap-2">
        <Button
          variant={selectedDietary.includes('veg') ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleDietary('veg')}
          className="h-9 gap-1"
        >
          <Leaf className="h-4 w-4" />
          Veg
        </Button>
        <Button
          variant={selectedSpiceLevel === 'hot' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSpiceLevelChange(selectedSpiceLevel === 'hot' ? null : 'hot')}
          className="h-9 gap-1"
        >
          <Flame className="h-4 w-4" />
          Spicy
        </Button>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 w-full mt-2 md:mt-0 md:w-auto">
          {selectedDietary.map((dietary) => (
            <Badge 
              key={dietary} 
              variant="secondary" 
              className="flex items-center gap-1 cursor-pointer hover:bg-destructive/20 transition-colors"
              onClick={() => toggleDietary(dietary)}
            >
              {dietary}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          {selectedSpiceLevel && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1 cursor-pointer hover:bg-destructive/20 transition-colors"
              onClick={() => onSpiceLevelChange(null)}
            >
              {selectedSpiceLevel}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1 cursor-pointer hover:bg-destructive/20 transition-colors"
              onClick={() => onPriceRangeChange([0, maxPrice])}
            >
              <Price amount={priceRange[0]} /> - <Price amount={priceRange[1]} />
              <X className="h-3 w-3" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
