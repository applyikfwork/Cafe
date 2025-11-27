
'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { VideoHero } from '@/components/ui/video-hero';
import { DynamicGreeting } from '@/components/ui/dynamic-greeting';
import { AnimatedButton } from '@/components/ui/animated-button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Clock, MapPin, Phone, TrendingUp, Sparkles, Coffee, UtensilsCrossed, Award, Heart } from 'lucide-react';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useActivePromotions } from '@/hooks/usePromotions';
import { useSettings } from '@/hooks/useSettings';
import { useTodaysSpecial } from '@/hooks/useTodaysSpecial';
import { initializeMockData } from '@/lib/firestore-service';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { FeaturedCarousel } from '@/components/home/featured-carousel';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { StatsSection } from '@/components/home/stats-section';
import { CTASection } from '@/components/home/cta-section';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const now = new Date();
  const topPromotion = activePromotions.find(p => 
    p.active && 
    p.title && 
    p.description && 
    new Date(p.startDate) <= now && 
    new Date(p.endDate) >= now
  );

  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-cafe');
  const heroImageUrl = settings.heroImageUrl || heroImage?.imageUrl || '';

  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      <main className="flex-1">
        <VideoHero fallbackImage={heroImageUrl}>
          <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-6">
            <div className="w-full max-w-2xl">
              {/* Greeting Badge */}
              <DynamicGreeting />
              
              {/* Main Title and Description */}
              {settingsLoading ? (
                <>
                  <Skeleton className="h-14 sm:h-20 w-3/4 max-w-2xl mb-3 sm:mb-4 mx-auto" />
                  <Skeleton className="h-5 sm:h-7 w-2/3 max-w-xl mx-auto" />
                </>
              ) : (
                <>
                  <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-headline font-black tracking-tighter drop-shadow-2xl animate-slide-down bg-gradient-to-r from-white via-amber-50 to-white bg-clip-text text-transparent leading-tight">
                    {settings.name}
                  </h1>
                  <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-lg md:text-xl text-white drop-shadow-lg animate-fade-in font-medium leading-relaxed">
                    {settings.description}
                  </p>
                </>
              )}

              {/* Promotion Badge */}
              {topPromotion && (
                <ScrollReveal direction="up" delay={0.2} className="mt-5 sm:mt-6 px-3 sm:px-0">
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500/90 to-red-500/90 border-2 border-orange-300/50 rounded-full backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all">
                    <TrendingUp className="h-4 w-4 flex-shrink-0 text-white animate-pulse" />
                    <span className="text-sm sm:text-base font-bold text-white">{topPromotion.title}</span>
                  </div>
                </ScrollReveal>
              )}
              
              {/* CTA Buttons */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 items-center justify-center px-2">
                <AnimatedButton href="/menu" variant="primary" size={isMobile ? "default" : "lg"} className="w-full sm:w-auto px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg font-bold shadow-xl hover:shadow-2xl">
                  <Coffee className="mr-2 h-5 w-5" />
                  Order Now
                </AnimatedButton>
                <AnimatedButton href="#" variant="secondary" size={isMobile ? "default" : "lg"} className="w-full sm:w-auto px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl">
                  <UtensilsCrossed className="mr-2 h-5 w-5" />
                  Reserve
                </AnimatedButton>
              </div>

              {/* Quick Info */}
              <div className="mt-6 sm:mt-8 flex flex-col gap-2 text-xs sm:text-sm text-white/95">
                {settingsLoading ? (
                  <>
                    <Skeleton className="h-4 w-40 mx-auto" />
                    <Skeleton className="h-4 w-40 mx-auto" />
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Open {settings.hours.open} - {settings.hours.close}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">{settings.phone}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </VideoHero>

        {topPromotion && (
          <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300 rounded-full blur-3xl animate-pulse" />
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center max-w-5xl mx-auto">
                {/* Left Content */}
                <ScrollReveal direction="left">
                  <div className="text-white">
                    <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-xs sm:text-sm font-bold">LIMITED TIME OFFER</span>
                    </div>
                    
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black mb-3 sm:mb-4 leading-tight">
                      {topPromotion.title}
                    </h2>
                    
                    <p className="text-base sm:text-lg text-white/90 mb-5 sm:mb-6 leading-relaxed">
                      {topPromotion.description}
                    </p>

                    {/* Discount Badge */}
                    <div className="mb-6 sm:mb-8">
                      <div className="inline-block bg-white/95 rounded-2xl px-6 sm:px-8 py-4 shadow-2xl">
                        <div className="text-center">
                          <div className="text-5xl sm:text-6xl font-black text-orange-600">
                            {topPromotion.type === 'percentage' ? `${topPromotion.value}%` : 
                             topPromotion.type === 'fixed' ? <><span className="currency-symbol">₹</span>{topPromotion.value}</> : 'BOGO'}
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-gray-600 mt-1">OFF</p>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 mb-6">
                      {topPromotion.code && (
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20">
                          <span className="text-sm font-medium text-white/80">Code:</span>
                          <code className="font-bold text-lg text-white">{topPromotion.code}</code>
                        </div>
                      )}
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20">
                        <Clock className="h-4 w-4 text-white/80 flex-shrink-0" />
                        <span className="text-sm font-medium text-white/80">
                          Valid {format(new Date(topPromotion.startDate), 'MMM dd')} - {format(new Date(topPromotion.endDate), 'MMM dd')}
                        </span>
                      </div>
                    </div>

                    <AnimatedButton href="/menu" variant="primary" size="lg" className="w-full bg-white text-orange-600 hover:bg-white/90 font-bold text-base sm:text-lg h-12 sm:h-14 shadow-xl">
                      Claim This Offer
                      <TrendingUp className="ml-2 h-5 w-5" />
                    </AnimatedButton>
                  </div>
                </ScrollReveal>

                {/* Right Visual */}
                <ScrollReveal direction="right" className="hidden md:block">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl blur-2xl" />
                    <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border-2 border-white/20 rounded-3xl p-6 sm:p-8 text-white text-center shadow-2xl">
                      <div className="space-y-4">
                        <div className="text-sm uppercase tracking-widest font-bold text-white/80">Your Savings</div>
                        <div className="text-5xl sm:text-6xl font-black">
                          {topPromotion.type === 'percentage' ? `${topPromotion.value}%` : 
                           topPromotion.type === 'fixed' ? <><span className="currency-symbol">₹</span>{topPromotion.value}</> : 'BOGO'}
                        </div>
                        <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full" />
                        <p className="text-lg text-white/90 font-semibold">{topPromotion.title}</p>
                        <div className="text-sm text-white/70 mt-4">
                          <div className="font-bold mb-2">⏰ Hurry Up!</div>
                          <div>Offer ends on {format(new Date(topPromotion.endDate), 'MMM dd, yyyy')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>
        )}

        <section className="py-24 md:py-32 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal direction="up" className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                Handcrafted Excellence
              </Badge>
              <h2 className="text-5xl md:text-6xl font-headline font-bold bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
                Our Signature Dishes
              </h2>
              <p className="mt-6 text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredItems.map((item, index) => {
                      const itemImage = PlaceHolderImages.find((img) => img.id === item.imageId);
                      return (
                        <ScrollReveal key={item.id} direction="up" delay={index * 0.15}>
                          <Card className="group overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm h-full">
                            <CardHeader className="p-0 relative overflow-hidden">
                              {itemImage && (
                                <div className="aspect-[4/3] relative">
                                  <Image
                                    src={itemImage.imageUrl}
                                    alt={item.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                                    data-ai-hint={itemImage.imageHint}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                                  {item.tags.includes('new' as any) && (
                                    <div className="absolute top-3 right-3 z-10">
                                      <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-lg">
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        NEW
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              )}
                            </CardHeader>
                            <CardContent className="p-6">
                              <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors mb-3">
                                {item.name}
                              </CardTitle>
                              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                                {item.description}
                              </p>
                              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                                  <span className="currency-symbol">₹</span>{new Intl.NumberFormat('en-IN').format(item.price)}
                                </p>
                                <Button 
                                  variant="outline" 
                                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white border-0 group-hover:scale-105 transition-all shadow-md"
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

            <ScrollReveal direction="up" delay={0.4} className="text-center mt-16">
              <AnimatedButton href="/menu" variant="primary" size="lg">
                Explore Full Menu
                <TrendingUp className="ml-2 h-5 w-5" />
              </AnimatedButton>
            </ScrollReveal>
          </div>
        </section>

        {/* Stats Section */}
        <StatsSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Call to Action */}
        <CTASection />

        <section className="py-24 md:py-32 bg-gradient-to-br from-primary/5 via-background to-orange-500/5 relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
              <ScrollReveal direction="left">
                <div className="relative h-[450px] md:h-[550px] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800"
                    alt="Our Story"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right">
                <div>
                  <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1">
                    <Heart className="h-3 w-3 mr-1" />
                    Since 2010
                  </Badge>
                  <h2 className="text-5xl md:text-6xl font-headline font-bold mb-8 bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                    Our Story
                  </h2>
                  <div className="space-y-6">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Founded in 2010, Cafe Central Station has been the beating heart of our community for over a decade. 
                      What began as a humble coffee shop has blossomed into a cherished gathering place where friendships 
                      are forged, ideas take flight, and unforgettable memories are created daily.
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      We partner with sustainable farms across the globe to source the finest coffee beans, and collaborate 
                      with talented local bakers to ensure the freshest pastries greet you each morning. Every cup is poured 
                      with precision, every dish is prepared with heart, and every experience is delivered with a genuine smile.
                    </p>
                    <div className="grid grid-cols-3 gap-6 pt-6">
                      <div className="text-center">
                        <Award className="h-10 w-10 text-primary mx-auto mb-2" />
                        <p className="text-3xl font-bold text-primary">15+</p>
                        <p className="text-sm text-muted-foreground">Awards</p>
                      </div>
                      <div className="text-center">
                        <Coffee className="h-10 w-10 text-primary mx-auto mb-2" />
                        <p className="text-3xl font-bold text-primary">10K+</p>
                        <p className="text-sm text-muted-foreground">Daily Cups</p>
                      </div>
                      <div className="text-center">
                        <Heart className="h-10 w-10 text-primary mx-auto mb-2" />
                        <p className="text-3xl font-bold text-primary">50K+</p>
                        <p className="text-sm text-muted-foreground">Happy Guests</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10">
                    <AnimatedButton href="#" variant="primary" size="lg">
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
