'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, Award, Sparkles } from 'lucide-react';
import type { GalleryItem } from '@/types';

interface PhotoOfDayProps {
  item: GalleryItem;
  isLiked: boolean;
  onLike: () => void;
  onClick: () => void;
}

export function PhotoOfDay({ item, isLiked, onLike, onClick }: PhotoOfDayProps) {
  return (
    <Card className="overflow-hidden mb-10 border-2 border-yellow-400/50 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Image */}
          <div 
            className="relative lg:w-2/3 aspect-video lg:aspect-auto cursor-pointer group"
            onClick={onClick}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Award Badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black border-0 shadow-lg px-3 py-1.5 text-sm font-bold">
                <Award className="h-4 w-4 mr-1" />
                Photo of the Day
              </Badge>
            </div>
          </div>

          {/* Info */}
          <div className="lg:w-1/3 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Featured Today</span>
            </div>
            
            <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
            {item.description && (
              <p className="text-muted-foreground mb-4">{item.description}</p>
            )}
            
            <Badge variant="outline" className="w-fit mb-4 capitalize">
              {item.category.replace('-', ' ')}
            </Badge>

            <div className="flex items-center gap-3">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onLike();
                }}
                className={isLiked ? 'bg-pink-500 hover:bg-pink-600' : ''}
              >
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-white' : ''}`} />
                {item.likes} likes
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
