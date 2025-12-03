'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { TrendingUp, Sparkles, Coffee, Award, Heart } from 'lucide-react';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useActivePromotions } from '@/hooks/usePromotions';
import { useSettings } from '@/hooks/useSettings';
import { useTodaysSpecial } from '@/hooks/useTodaysSpecial';
import { initializeMockData } from '@/lib/firestore-service';
import { Currency } from '@/components/ui/currency';
import { FeaturedCarousel } from '@/components/home/featured-carousel';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { StatsSection } from '@/components/home/stats-section';
import { CTASection } from '@/components/home/cta-section';
import { HeroSection } from '@/components/home/hero-section';
import { PromotionsSection } from '@/components/home/promotions-section';
import { ExperienceSection } from '@/components/home/experience-section';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatedButton } from '@/components/ui/animated-button';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { items: menuItems, loading: menuLoading } = useMenuItems();
  const { promotions: activePromotions } = useActivePromotions();
  const { settings, loading: settingsLoading } = useSettings();
  const { special } = useTodaysSpecial();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const featuredItems = menuItems.filter(item => item.tags.includes('new' as any) || item.tags.includes('veg' as any)).slice(0, 3);

  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-cafe');
  const heroImageUrl = settings.heroImageUrl || heroImage?.imageUrl || '';

  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <HeroSection 
          settings={settings}
          settingsLoading={settingsLoading}
          heroImageUrl={heroImageUrl}
          isMobile={isMobile}
        />

        <PromotionsSection promotions={activePromotions} />

        <section className="py-16 sm:py-20 md:py-28 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
            <div className="absolute top-20 right-20 w-72 h-72 rounded-full border-2 border-primary/30 animate-spin-slow" />
            <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full border border-accent/20 animate-reverse-spin" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal direction="up" className="text-center mb-12 sm:mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-6 py-2 text-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                Handcrafted Excellence
              </Badge>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent mb-4">
                Our Signature Dishes
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                Discover the flavors that keep our guests coming back. Each dish is thoughtfully crafted 
                with premium ingredients and served with passion.
              </p>
            </ScrollReveal>

            {menuLoading ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                    <Coffee className="h-8 w-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-lg font-medium">Loading delicious options...</p>
                </div>
              </div>
            ) : (
              <div className="max-w-6xl mx-auto">
                {isMobile ? (
                  <FeaturedCarousel items={featuredItems} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {featuredItems.map((item, index) => {
                      const itemImage = PlaceHolderImages.find((img) => img.id === item.imageId);
                      return (
                        <ScrollReveal key={item.id} direction="up" delay={index * 0.15}>
                          <Card className="group overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 bg-card/80 backdrop-blur-sm h-full rounded-3xl">
                            <CardHeader className="p-0 relative overflow-hidden">
                              {itemImage && (
                                <div className="aspect-[4/3] relative">
                                  <Image
                                    src={itemImage.imageUrl}
                                    alt={item.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover transition-all duration-700 group-hover:scale-110"
                                    data-ai-hint={itemImage.imageHint}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                                  {item.tags.includes('new' as any) && (
                                    <div className="absolute top-4 right-4 z-10">
                                      <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-lg px-3 py-1">
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        NEW
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              )}
                            </CardHeader>
                            <CardContent className="p-6">
                              <CardTitle className="font-headline text-xl sm:text-2xl group-hover:text-primary transition-colors mb-3">
                                {item.name}
                              </CardTitle>
                              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-5">
                                {item.description}
                              </p>
                              <div className="flex justify-between items-center pt-4 border-t border-border/50">
                                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                                  <Currency amount={item.price} />
                                </p>
                                <Button 
                                  variant="outline" 
                                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white border-0 group-hover:scale-105 transition-all shadow-md rounded-xl"
                                >
                                  Add to Order
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <ScrollReveal direction="up" delay={0.4} className="text-center mt-12 sm:mt-16">
              <AnimatedButton href="/menu" variant="primary" size="lg" className="shadow-xl rounded-2xl">
                Explore Full Menu
                <TrendingUp className="ml-2 h-5 w-5" />
              </AnimatedButton>
            </ScrollReveal>
          </div>
        </section>

        <ExperienceSection />

        <StatsSection />

        <TestimonialsSection />

        <CTASection />

        <section className="py-16 sm:py-20 md:py-28 bg-gradient-to-br from-primary/5 via-background to-orange-500/5 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto">
              <ScrollReveal direction="left">
                <div className="relative h-[350px] sm:h-[450px] md:h-[550px] rounded-3xl overflow-hidden shadow-2xl group">
                  <Image
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800"
                    alt="Our Story"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <Heart className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-lg">Since 2010</p>
                          <p className="text-sm text-muted-foreground">Serving happiness daily</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right">
                <div>
                  <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-6 py-2 text-sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Our Journey
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-6 sm:mb-8 bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                    Our Story
                  </h2>
                  <div className="space-y-4 sm:space-y-6">
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                      Founded in 2010, Cafe Central Station has been the beating heart of our community for over a decade. 
                      What began as a humble coffee shop has blossomed into a cherished gathering place where friendships 
                      are forged, ideas take flight, and unforgettable memories are created daily.
                    </p>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                      We partner with sustainable farms across the globe to source the finest coffee beans, and collaborate 
                      with talented local bakers to ensure the freshest pastries greet you each morning.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-8 mt-6 border-t border-border/50">
                    <div className="text-center p-3 sm:p-4 bg-primary/5 rounded-2xl">
                      <Award className="h-8 w-8 sm:h-10 sm:w-10 text-primary mx-auto mb-2" />
                      <p className="text-2xl sm:text-3xl font-bold text-primary">15+</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Awards</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-primary/5 rounded-2xl">
                      <Coffee className="h-8 w-8 sm:h-10 sm:w-10 text-primary mx-auto mb-2" />
                      <p className="text-2xl sm:text-3xl font-bold text-primary">10K+</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Daily Cups</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-primary/5 rounded-2xl">
                      <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-primary mx-auto mb-2" />
                      <p className="text-2xl sm:text-3xl font-bold text-primary">50K+</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Happy Guests</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 sm:mt-10">
                    <AnimatedButton href="#" variant="primary" size="lg" className="shadow-xl rounded-2xl">
                      Discover Our Journey
                    </AnimatedButton>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
