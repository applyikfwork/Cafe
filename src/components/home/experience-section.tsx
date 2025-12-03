'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { 
  Coffee, 
  Wifi, 
  Music, 
  Leaf, 
  Clock, 
  Heart,
  Sparkles,
  Sun,
  Moon,
  Utensils
} from 'lucide-react';

const experiences = [
  {
    icon: Coffee,
    title: 'Premium Coffee',
    description: 'Ethically sourced beans roasted to perfection',
    gradient: 'from-amber-500 to-orange-600',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'
  },
  {
    icon: Utensils,
    title: 'Fresh Cuisine',
    description: 'Chef-crafted dishes made with local ingredients',
    gradient: 'from-green-500 to-emerald-600',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'
  },
  {
    icon: Wifi,
    title: 'Free High-Speed WiFi',
    description: 'Stay connected while you enjoy your meal',
    gradient: 'from-blue-500 to-indigo-600',
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400'
  },
  {
    icon: Music,
    title: 'Ambient Vibes',
    description: 'Carefully curated playlists for the perfect mood',
    gradient: 'from-purple-500 to-pink-600',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400'
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly',
    description: 'Sustainable practices for a better tomorrow',
    gradient: 'from-teal-500 to-green-600',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400'
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Every dish prepared with passion and care',
    gradient: 'from-rose-500 to-red-600',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'
  }
];

const atmosphereImages = [
  {
    src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600',
    alt: 'Cozy cafe interior',
    span: 'col-span-2 row-span-2'
  },
  {
    src: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400',
    alt: 'Coffee being poured',
    span: 'col-span-1'
  },
  {
    src: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400',
    alt: 'Cafe seating area',
    span: 'col-span-1'
  },
  {
    src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
    alt: 'Pastry display',
    span: 'col-span-1'
  },
  {
    src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    alt: 'Latte art',
    span: 'col-span-1'
  }
];

export function ExperienceSection() {
  return (
    <section className="py-16 sm:py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-40 left-1/4 w-80 h-80 rounded-full border-2 border-primary/30 animate-spin-slow" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 rounded-full border border-accent/20 animate-reverse-spin" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal direction="up" className="text-center mb-16 sm:mb-20">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-6 py-2 text-sm">
            <Sparkles className="h-4 w-4 mr-2" />
            The Experience
          </Badge>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold mb-4 bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
            Why Choose Us
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            More than just a cafe - we're your neighborhood gathering spot, your creative workspace, 
            and your escape from the everyday.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-20 max-w-6xl mx-auto">
          {experiences.map((exp, index) => {
            const Icon = exp.icon;
            return (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <Card className="group relative overflow-hidden border-2 hover:border-primary/30 bg-card/80 backdrop-blur-sm transition-all duration-500 hover:shadow-xl rounded-3xl h-full">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                    <Image
                      src={exp.image}
                      alt={exp.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  
                  <CardContent className="relative z-10 p-6 sm:p-8">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${exp.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal direction="up" className="mb-8 text-center">
          <Badge className="mb-4 bg-accent/10 text-accent border-accent/20 px-6 py-2 text-sm">
            <Sun className="h-4 w-4 mr-2" />
            Our Atmosphere
          </Badge>
          <h3 className="text-3xl sm:text-4xl font-headline font-bold mb-4">
            Step Into Our World
          </h3>
        </ScrollReveal>

        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-4 max-w-5xl mx-auto h-[500px]">
          {atmosphereImages.map((img, index) => (
            <ScrollReveal 
              key={index} 
              direction="up" 
              delay={index * 0.1}
              className={`${img.span} overflow-hidden rounded-3xl group cursor-pointer`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium">{img.alt}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="md:hidden grid grid-cols-2 gap-3 max-w-lg mx-auto">
          {atmosphereImages.slice(0, 4).map((img, index) => (
            <ScrollReveal 
              key={index} 
              direction="up" 
              delay={index * 0.1}
              className="aspect-square overflow-hidden rounded-2xl"
            >
              <div className="relative w-full h-full">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
