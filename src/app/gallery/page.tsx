'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { useGallery } from '@/hooks/useGallery';
import { LightboxViewer } from '@/components/gallery/lightbox-viewer';
import { PhotoOfDay } from '@/components/gallery/photo-of-day';
import { VideoSection } from '@/components/gallery/video-section';
import { PhotoContest } from '@/components/gallery/photo-contest';
import { CustomerSubmissions } from '@/components/gallery/customer-submissions';
import { 
  Camera, 
  Grid3X3, 
  LayoutGrid, 
  Heart, 
  Eye,
  Utensils,
  PartyPopper,
  ChefHat,
  Building,
  ImageIcon
} from 'lucide-react';
import type { GalleryItem } from '@/types';

type GalleryCategory = 'all' | 'ambiance' | 'food' | 'events' | 'behind-the-scenes';
type LayoutType = 'grid' | 'masonry';

const categoryIcons: Record<GalleryCategory, any> = {
  all: ImageIcon,
  ambiance: Building,
  food: Utensils,
  events: PartyPopper,
  'behind-the-scenes': ChefHat,
};

const categoryLabels: Record<GalleryCategory, string> = {
  all: 'All Photos',
  ambiance: 'Ambiance',
  food: 'Food',
  events: 'Events',
  'behind-the-scenes': 'Behind the Scenes',
};

export default function GalleryPage() {
  const { 
    items, 
    contestPhotos, 
    videos,
    isLiked, 
    toggleLike, 
    getPhotoOfDay,
    getByCategory,
    mounted 
  } = useGallery();

  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('all');
  const [layout, setLayout] = useState<LayoutType>('masonry');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('gallery');

  const photoOfDay = getPhotoOfDay();
  const filteredItems = useMemo(() => getByCategory(selectedCategory), [selectedCategory, getByCategory]);

  const openLightbox = (item: GalleryItem) => {
    const index = filteredItems.findIndex(i => i.id === item.id);
    setLightboxIndex(index >= 0 ? index : 0);
    setLightboxOpen(true);
  };

  const handleCustomerSubmission = (data: any) => {
    console.log('Customer submission:', data);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <ScrollReveal direction="up" className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Camera className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Visual Stories</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-headline font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              Our Gallery
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the moments, flavors, and experiences that make Cafe Central Station special
            </p>
          </ScrollReveal>

          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <div className="flex justify-center">
              <TabsList className="bg-card/50 backdrop-blur-sm p-1.5 shadow-lg border">
                <TabsTrigger 
                  value="gallery"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-purple-500 data-[state=active]:text-white px-6"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Gallery
                </TabsTrigger>
                <TabsTrigger 
                  value="videos"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-purple-500 data-[state=active]:text-white px-6"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Videos
                </TabsTrigger>
                <TabsTrigger 
                  value="contest"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-purple-500 data-[state=active]:text-white px-6"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Contest
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="mt-8">
              {/* Photo of the Day */}
              {mounted && photoOfDay && (
                <PhotoOfDay
                  item={photoOfDay}
                  isLiked={isLiked(photoOfDay.id)}
                  onLike={() => toggleLike(photoOfDay.id)}
                  onClick={() => openLightbox(photoOfDay)}
                />
              )}

              {/* Category Filter & Layout Toggle */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(categoryLabels) as GalleryCategory[]).map((category) => {
                    const Icon = categoryIcons[category];
                    const isSelected = selectedCategory === category;
                    return (
                      <Button
                        key={category}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className={isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {categoryLabels[category]}
                      </Button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Layout:</span>
                  <Button
                    variant={layout === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setLayout('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={layout === 'masonry' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setLayout('masonry')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Photo Grid */}
              <div className={`
                ${layout === 'grid' 
                  ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' 
                  : 'columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4'
                }
              `}>
                {filteredItems.map((item, index) => (
                  <ScrollReveal 
                    key={item.id} 
                    direction="up" 
                    delay={index * 0.05}
                    className={layout === 'masonry' ? 'break-inside-avoid mb-4' : ''}
                  >
                    <Card 
                      className="overflow-hidden cursor-pointer group"
                      onClick={() => openLightbox(item)}
                    >
                      <CardContent className="p-0 relative">
                        <div className={layout === 'grid' ? 'aspect-square' : ''}>
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="text-xs capitalize">
                                {item.category.replace('-', ' ')}
                              </Badge>
                              <div className="flex items-center gap-1 text-white">
                                <Heart className="h-4 w-4" />
                                <span className="text-sm">{item.likes}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Like Button */}
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(item.id);
                          }}
                        >
                          <Heart className={`h-4 w-4 ${isLiked(item.id) ? 'fill-pink-500 text-pink-500' : ''}`} />
                        </Button>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>

              {/* Customer Submissions */}
              <div className="mt-16">
                <CustomerSubmissions onSubmit={handleCustomerSubmission} />
              </div>
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos" className="mt-8">
              <VideoSection videos={videos} />
              
              <div className="text-center py-16">
                <ChefHat className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">More Videos Coming Soon</h3>
                <p className="text-muted-foreground">Stay tuned for more behind-the-scenes content!</p>
              </div>
            </TabsContent>

            {/* Contest Tab */}
            <TabsContent value="contest" className="mt-8">
              <PhotoContest
                photos={contestPhotos}
                isLiked={isLiked}
                onLike={toggleLike}
                onPhotoClick={(photo) => {
                  const allPhotos = [...contestPhotos];
                  const index = allPhotos.findIndex(p => p.id === photo.id);
                  setLightboxIndex(index >= 0 ? index : 0);
                  setLightboxOpen(true);
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Lightbox Viewer */}
      <LightboxViewer
        items={activeTab === 'contest' ? contestPhotos : filteredItems}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setLightboxIndex}
        isLiked={isLiked}
        onToggleLike={toggleLike}
      />
      
      <Footer />
    </div>
  );
}
