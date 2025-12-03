'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Play, Video, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
}

interface VideoSectionProps {
  videos: VideoItem[];
}

export function VideoSection({ videos }: VideoSectionProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  if (videos.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
            <Video className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Behind the Scenes</h2>
            <p className="text-sm text-muted-foreground">Watch our food preparation videos</p>
          </div>
        </div>
      </div>

      <div 
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.map((video) => (
          <Card
            key={video.id}
            className="flex-shrink-0 w-[300px] md:w-[350px] cursor-pointer group overflow-hidden"
            onClick={() => setSelectedVideo(video)}
          >
            <CardContent className="p-0">
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-primary ml-1" fill="currentColor" />
                  </div>
                </div>
                <Badge className="absolute bottom-3 right-3 bg-black/70 text-white border-0">
                  {video.duration}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Video Player Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black border-none">
          <VisuallyHidden>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
          </VisuallyHidden>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-50 text-white hover:bg-white/20"
            onClick={() => setSelectedVideo(null)}
          >
            <X className="h-6 w-6" />
          </Button>
          {selectedVideo && (
            <div className="aspect-video">
              <iframe
                src={selectedVideo.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
