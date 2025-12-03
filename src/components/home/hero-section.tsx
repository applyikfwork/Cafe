'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DynamicGreeting } from '@/components/ui/dynamic-greeting';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Skeleton } from '@/components/ui/skeleton';
import { Coffee, UtensilsCrossed, Clock, Phone, Star, Sparkles, MapPin, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  settings: any;
  settingsLoading: boolean;
  heroImageUrl: string;
  isMobile: boolean;
}

export function HeroSection({ settings, settingsLoading, heroImageUrl, isMobile }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight - 100, behavior: 'smooth' });
  };

  return (
    <section className="relative w-full min-h-[100vh] md:min-h-[100vh] text-white overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={heroImageUrl || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920"}
          alt="Cafe Hero"
          fill
          priority
          className="object-cover scale-105 animate-slow-zoom"
          sizes="100vw"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-orange-900/30 via-transparent to-amber-900/30" />
      
      {mounted && (
        <>
          <div className="absolute top-10 left-10 w-32 h-32 md:w-48 md:h-48 opacity-20">
            <div className="w-full h-full border-2 border-amber-400/50 rounded-full animate-spin-slow" />
            <div className="absolute inset-4 border border-orange-400/30 rounded-full animate-reverse-spin" />
          </div>
          
          <div className="absolute bottom-20 right-10 w-24 h-24 md:w-40 md:h-40 opacity-20">
            <div className="w-full h-full border-2 border-amber-400/50 rounded-full animate-spin-slow" />
          </div>
          
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float-particle opacity-40"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${4 + i * 0.5}s`,
                }}
              >
                <Coffee className="w-4 h-4 md:w-6 md:h-6 text-amber-400" />
              </div>
            ))}
          </div>
        </>
      )}

      <div className="relative h-full min-h-[100vh] flex flex-col items-center justify-center z-10 px-4 sm:px-6 py-20">
        <div className="w-full max-w-4xl mx-auto text-center">
          <DynamicGreeting />
          
          <div className="flex justify-center gap-2 mb-6 animate-fade-in-up">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-sm text-white/80 ml-2">4.9/5 Rating</span>
          </div>
          
          {settingsLoading || !settings ? (
            <>
              <Skeleton className="h-16 sm:h-24 w-3/4 max-w-2xl mb-4 mx-auto bg-white/10" />
              <Skeleton className="h-6 sm:h-8 w-2/3 max-w-xl mx-auto bg-white/10" />
            </>
          ) : (
            <>
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-headline font-black tracking-tight drop-shadow-2xl animate-hero-text-reveal leading-[1.1]">
                <span className="bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
                  {settings.name || 'Cafe Central Station'}
                </span>
              </h1>
              
              <p className="mt-6 sm:mt-8 max-w-2xl mx-auto text-base sm:text-xl md:text-2xl text-white/90 drop-shadow-lg animate-fade-in-up font-medium leading-relaxed" style={{ animationDelay: '0.3s' }}>
                {settings.description || 'Discover the perfect blend of taste and ambiance'}
              </p>
            </>
          )}

          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <AnimatedButton 
              href="/menu" 
              variant="primary" 
              size={isMobile ? "default" : "lg"} 
              className="w-full sm:w-auto px-8 sm:px-12 h-14 sm:h-16 text-base sm:text-lg font-bold shadow-2xl hover:shadow-orange-500/25 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-0 rounded-2xl group"
            >
              <Coffee className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              Order Now
            </AnimatedButton>
            
            <AnimatedButton 
              href="#" 
              variant="secondary" 
              size={isMobile ? "default" : "lg"} 
              className="w-full sm:w-auto px-8 sm:px-12 h-14 sm:h-16 text-base sm:text-lg font-bold shadow-xl bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 hover:border-white/50 text-white rounded-2xl group"
            >
              <UtensilsCrossed className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Reserve Table
            </AnimatedButton>
          </div>

          <div className="mt-10 sm:mt-14 flex flex-wrap justify-center gap-4 sm:gap-8 text-sm sm:text-base text-white/90 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            {!settingsLoading && settings && (
              <>
                {settings.hours && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <Clock className="h-4 w-4 text-amber-400" />
                    <span className="font-medium">{settings.hours.open || '9:00 AM'} - {settings.hours.close || '10:00 PM'}</span>
                  </div>
                )}
                {settings.phone && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <Phone className="h-4 w-4 text-amber-400" />
                    <span className="font-medium">{settings.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <MapPin className="h-4 w-4 text-amber-400" />
                  <span className="font-medium">Downtown Location</span>
                </div>
              </>
            )}
          </div>
        </div>

        <button 
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors animate-bounce cursor-pointer"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
