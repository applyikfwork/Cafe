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
import { Instagram, Camera, Upload, Heart, ExternalLink } from 'lucide-react';
import type { GalleryItem } from '@/types';

interface CustomerSubmissionsProps {
  onSubmit: (data: any) => void;
}

// Sample Instagram-style posts
const instagramPosts = [
  {
    id: 'ig1',
    username: '@coffeelover_daily',
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400',
    caption: 'Perfect morning vibes ☕️ #CafeCentralStation',
    likes: 234,
  },
  {
    id: 'ig2',
    username: '@foodie_adventures',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    caption: 'This brunch is everything! 🍳 #BrunchGoals',
    likes: 456,
  },
  {
    id: 'ig3',
    username: '@aesthetic.cafe',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
    caption: 'The coziest corner in town 📚 #CafeLife',
    likes: 189,
  },
  {
    id: 'ig4',
    username: '@sweet.treats',
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400',
    caption: 'Dessert dreams come true 🍰 #Dessert',
    likes: 567,
  },
];

export function CustomerSubmissions({ onSubmit }: CustomerSubmissionsProps) {
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [formData, setFormData] = useState({
    instagramHandle: '',
    email: '',
    caption: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    alert('Thank you! Your photo will be reviewed and added to our gallery.');
    setIsSubmitOpen(false);
    setFormData({ instagramHandle: '', email: '', caption: '' });
  };

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-lg">
            <Instagram className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Customer Photos</h2>
            <p className="text-sm text-muted-foreground">Share your moments with #CafeCentralStation</p>
          </div>
        </div>

        <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Camera className="h-4 w-4 mr-2" />
              Share Your Photo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Share Your Photo</DialogTitle>
              <DialogDescription>
                Submit your photo to be featured in our gallery
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram Handle</Label>
                <Input
                  id="instagram"
                  placeholder="@yourusername"
                  value={formData.instagramHandle}
                  onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  placeholder="Tell us about your photo..."
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Photo</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload your photo
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Submit Photo
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Instagram-style Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {instagramPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden group cursor-pointer">
            <CardContent className="p-0 relative">
              <div className="aspect-square relative">
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Heart className="h-6 w-6 fill-white" />
                      <span className="font-bold">{post.likes}</span>
                    </div>
                    <p className="text-sm">{post.username}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Follow CTA */}
      <div className="mt-6 text-center p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20 rounded-xl">
        <Instagram className="h-10 w-10 mx-auto mb-3 text-pink-500" />
        <h3 className="font-bold text-lg mb-2">Follow Us on Instagram</h3>
        <p className="text-muted-foreground mb-4">
          Tag us @cafecentralstation for a chance to be featured!
        </p>
        <Button className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white border-0">
          <Instagram className="h-4 w-4 mr-2" />
          Follow @cafecentralstation
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
