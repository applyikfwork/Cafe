'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { VideoHero } from '@/components/ui/video-hero';
import { DynamicGreeting } from '@/components/ui/dynamic-greeting';
import { AnimatedButton } from '@/components/ui/animated-button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Clock, MapPin, Phone } from 'lucide-react';
import { useMenuItems } from '@/hooks/useMenuItems';
import { initializeMockData } from '@/lib/firestore-service';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-cafe');
  const { items: menuItems, loading } = useMenuItems();
  const featuredItems = menuItems.slice(0, 3);

  // Initialize mock data on component mount
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <VideoHero
          fallbackImage={heroImage?.imageUrl || ''}
        >
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <DynamicGreeting />
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight drop-shadow-2xl animate-slide-down">
              Cafe Central Station
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl text-stone-100 drop-shadow-lg animate-fade-in">
              Where every cup tells a story and every bite feels like home.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <AnimatedButton href="/menu" variant="primary" size="lg">
                Order Now
              </AnimatedButton>
              <AnimatedButton href="#" variant="secondary" size="lg">
                Reserve a Table
              </AnimatedButton>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/90 animate-slide-up">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Open 7am - 9pm Daily</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>123 Central Street</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </div>
            </div>
          </div>
        </VideoHero>

        <section className="py-20 md:py-32 bg-background relative">
          <div className="container mx-auto px-4">
            <ScrollReveal direction="up" className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-headline font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Our Specialties
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
                Discover the flavors that our regulars rave about. Handcrafted with love and the finest ingredients.
              </p>
            </ScrollReveal>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading menu...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredItems.map((item, index) => {
                  const itemImage = PlaceHolderImages.find((img) => img.id === item.imageId);
                  return (
                    <ScrollReveal key={item.id} direction="up" delay={index * 0.1}>
                      <Card className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50">
                        <CardHeader className="p-0 relative overflow-hidden">
                          {itemImage && (
                            <div className="aspect-video relative">
                              <Image
                                src={itemImage.imageUrl}
                                alt={item.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                data-ai-hint={itemImage.imageHint}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="p-6">
                          <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors">
                            {item.name}
                          </CardTitle>
                          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                            {item.description}
                          </p>
                          <div className="flex justify-between items-center mt-6">
                            <p className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</p>
                            <Button 
                              variant="outline" 
                              className="group-hover:bg-primary group-hover:text-primary-foreground transition-all"
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

            <ScrollReveal direction="up" delay={0.3} className="text-center mt-16">
              <AnimatedButton href="/menu" variant="primary" size="lg">
                View Full Menu →
              </AnimatedButton>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <ScrollReveal direction="left">
                <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800"
                    alt="Our Story"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-cover"
                  />
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right">
                <div>
                  <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6">
                    Our Story
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    Founded in 2010, Cafe Central Station has been the heart of our community for over a decade. 
                    What started as a small coffee shop has grown into a beloved gathering place where friends meet, 
                    ideas flourish, and memories are made.
                  </p>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    We source our coffee beans from sustainable farms around the world and work with local bakers 
                    to bring you the freshest pastries every morning. Every cup, every dish is crafted with passion 
                    and served with a smile.
                  </p>
                  <AnimatedButton href="#" variant="primary">
                    Learn More About Us
                  </AnimatedButton>
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
