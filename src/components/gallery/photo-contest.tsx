'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trophy, Heart, Camera, Upload, User, Clock, ChevronRight } from 'lucide-react';
import type { GalleryItem } from '@/types';

interface PhotoContestProps {
  photos: GalleryItem[];
  isLiked: (id: string) => boolean;
  onLike: (id: string) => void;
  onPhotoClick: (photo: GalleryItem) => void;
}

export function PhotoContest({ photos, isLiked, onLike, onPhotoClick }: PhotoContestProps) {
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submission
    alert('Thank you for your submission! We will review it shortly.');
    setIsSubmitOpen(false);
    setFormData({ name: '', email: '', title: '', description: '' });
  };

  // Sort by likes for leaderboard
  const sortedPhotos = [...photos].sort((a, b) => b.likes - a.likes);

  return (
    <div className="mb-10">
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-2xl md:text-3xl font-bold">Photo Contest</h2>
              <p className="text-white/80">Share your best cafe moments and win prizes!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
              <Clock className="h-5 w-5 text-white" />
              <span className="text-white font-medium">Ends in 5 days</span>
            </div>
            
            <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-purple-600 hover:bg-white/90">
                  <Camera className="h-4 w-4 mr-2" />
                  Submit Photo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Submit Your Photo</DialogTitle>
                  <DialogDescription>
                    Share your best cafe moment for a chance to win exciting prizes!
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Photo Title</Label>
                    <Input
                      id="title"
                      placeholder="My Perfect Coffee Moment"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell us about this photo..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Photo</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Submit Entry
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Contest Entries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sortedPhotos.map((photo, index) => (
          <Card 
            key={photo.id} 
            className="overflow-hidden cursor-pointer group relative"
            onClick={() => onPhotoClick(photo)}
          >
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                {/* Ranking Badge */}
                {index < 3 && (
                  <div className="absolute top-3 left-3">
                    <Badge 
                      className={`border-0 text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        'bg-amber-600'
                      }`}
                    >
                      <Trophy className="h-3 w-3 mr-1" />
                      #{index + 1}
                    </Badge>
                  </div>
                )}

                {/* Like Button */}
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike(photo.id);
                  }}
                >
                  <Heart 
                    className={`h-4 w-4 ${isLiked(photo.id) ? 'fill-pink-500 text-pink-500' : ''}`} 
                  />
                </Button>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="font-bold text-white mb-1">{photo.title}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-white/80 text-sm">
                      <User className="h-3 w-3" />
                      {photo.submittedBy}
                    </div>
                    <div className="flex items-center gap-1 text-white">
                      <Heart className="h-4 w-4 fill-white" />
                      <span className="font-medium">{photo.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Prizes Section */}
      <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Contest Prizes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-white dark:bg-background rounded-lg">
            <Badge className="bg-yellow-500 text-white border-0 text-lg">1st</Badge>
            <div>
              <p className="font-semibold">₹5,000 Gift Card</p>
              <p className="text-sm text-muted-foreground">+ Featured on Instagram</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white dark:bg-background rounded-lg">
            <Badge className="bg-gray-400 text-white border-0 text-lg">2nd</Badge>
            <div>
              <p className="font-semibold">₹2,500 Gift Card</p>
              <p className="text-sm text-muted-foreground">+ Free meal for 2</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white dark:bg-background rounded-lg">
            <Badge className="bg-amber-600 text-white border-0 text-lg">3rd</Badge>
            <div>
              <p className="font-semibold">₹1,000 Gift Card</p>
              <p className="text-sm text-muted-foreground">+ Cafe merchandise</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
