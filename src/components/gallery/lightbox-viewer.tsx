'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Share2, 
  Download,
  Facebook,
  Twitter,
  Instagram,
  Link2
} from 'lucide-react';
import type { GalleryItem } from '@/types';

interface LightboxViewerProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  isLiked: (id: string) => boolean;
  onToggleLike: (id: string) => void;
}

export function LightboxViewer({
  items,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
  isLiked,
  onToggleLike,
}: LightboxViewerProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const currentItem = items[currentIndex];

  const goToNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      onIndexChange(currentIndex + 1);
    }
  }, [currentIndex, items.length, onIndexChange]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  }, [currentIndex, onIndexChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToNext, goToPrev, onClose]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      goToNext();
    } else if (distance < -minSwipeDistance) {
      goToPrev();
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this photo: ${currentItem?.title}`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }
    setShowShareMenu(false);
  };

  if (!currentItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-[100vw] max-h-[100vh] w-screen h-screen p-0 bg-black/95 border-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <VisuallyHidden>
          <DialogTitle>{currentItem.title}</DialogTitle>
        </VisuallyHidden>
        
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
            onClick={goToPrev}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        )}
        
        {currentIndex < items.length - 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
            onClick={goToNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        )}

        {/* Main Image */}
        <div className="w-full h-full flex items-center justify-center p-4 md:p-16">
          <img
            src={currentItem.imageUrl}
            alt={currentItem.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Bottom Info Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="text-white">
              <h3 className="text-xl md:text-2xl font-bold mb-1">{currentItem.title}</h3>
              {currentItem.description && (
                <p className="text-white/70 text-sm md:text-base">{currentItem.description}</p>
              )}
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="secondary" className="capitalize">
                  {currentItem.category.replace('-', ' ')}
                </Badge>
                {currentItem.submittedBy && (
                  <span className="text-white/60 text-sm">by {currentItem.submittedBy}</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={`text-white hover:bg-white/20 ${isLiked(currentItem.id) ? 'text-pink-500' : ''}`}
                onClick={() => onToggleLike(currentItem.id)}
              >
                <Heart className={`h-5 w-5 mr-1 ${isLiked(currentItem.id) ? 'fill-pink-500' : ''}`} />
                {currentItem.likes}
              </Button>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                >
                  <Share2 className="h-5 w-5 mr-1" />
                  Share
                </Button>

                {showShareMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl p-2 min-w-[150px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleShare('facebook')}
                    >
                      <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                      Facebook
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleShare('twitter')}
                    >
                      <Twitter className="h-4 w-4 mr-2 text-sky-500" />
                      Twitter
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleShare('copy')}
                    >
                      <Link2 className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Image Counter */}
          <div className="text-center text-white/50 text-sm mt-4">
            {currentIndex + 1} / {items.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
