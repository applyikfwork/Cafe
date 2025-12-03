'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { AnimatedButton } from '@/components/ui/animated-button';
import { DiscountBadge } from '@/components/ui/currency';
import { 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Percent, 
  Gift, 
  Zap,
  Timer,
  ArrowRight
} from 'lucide-react';
import { format, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { Promotion } from '@/types';

interface PromotionsSectionProps {
  promotions: Promotion[];
}

function CountdownTimer({ endDate }: { endDate: Date }) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeLeft = () => {
      const end = endDate instanceof Date ? endDate : new Date(endDate);
      const now = new Date();
      
      if (end <= now) {
        return { days: 0, hours: 0, minutes: 0 };
      }

      return {
        days: differenceInDays(end, now),
        hours: differenceInHours(end, now) % 24,
        minutes: differenceInMinutes(end, now) % 60,
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (!mounted) {
    return (
      <div className="flex gap-2 sm:gap-3 justify-center">
        {['Days', 'Hours', 'Mins'].map((label, i) => (
          <div key={i} className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-4 sm:py-3 min-w-[60px] sm:min-w-[70px] text-center border border-white/30">
            <div className="text-xl sm:text-2xl font-black text-white">--</div>
            <div className="text-[10px] sm:text-xs text-white/80 uppercase tracking-wide">{label}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hours' },
        { value: timeLeft.minutes, label: 'Mins' },
      ].map((item, i) => (
        <div key={i} className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 sm:px-4 sm:py-3 min-w-[60px] sm:min-w-[70px] text-center border border-white/30">
          <div className="text-xl sm:text-2xl font-black text-white">{item.value}</div>
          <div className="text-[10px] sm:text-xs text-white/80 uppercase tracking-wide">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function PromotionCard({ promotion, featured = false, index = 0 }: { promotion: Promotion; featured?: boolean; index?: number }) {
  const getIcon = () => {
    switch (promotion.type) {
      case 'percentage': return Percent;
      case 'bogo': return Gift;
      default: return Zap;
    }
  };
  const Icon = getIcon();

  const gradients = [
    'from-orange-500 via-red-500 to-pink-500',
    'from-purple-500 via-pink-500 to-rose-500',
    'from-emerald-500 via-teal-500 to-cyan-500',
    'from-amber-500 via-orange-500 to-red-500',
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <Card className={`group relative overflow-hidden border-2 border-white/10 hover:border-white/30 transition-all duration-500 ${featured ? 'md:col-span-2' : ''}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`} />
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/50 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
      </div>
      
      <CardContent className="relative z-10 p-6 sm:p-8 text-white">
        <div className="flex items-start justify-between mb-4">
          <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 mr-1" />
            LIMITED TIME
          </Badge>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6" />
          </div>
        </div>

        <h3 className="text-2xl sm:text-3xl font-headline font-black mb-3 leading-tight">
          {promotion.title}
        </h3>
        
        <p className="text-white/80 mb-6 text-sm sm:text-base leading-relaxed">
          {promotion.description}
        </p>

        <div className="mb-6 p-4 sm:p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-black mb-1">
              <DiscountBadge type={promotion.type} value={promotion.value} />
            </div>
            <p className="text-xs sm:text-sm text-white/70 uppercase tracking-wide font-medium">Your Savings</p>
          </div>
        </div>

        {featured && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Timer className="w-4 h-4 text-white/80" />
              <span className="text-xs sm:text-sm text-white/80 uppercase tracking-wide font-medium">Hurry! Offer ends in:</span>
            </div>
            <CountdownTimer endDate={promotion.endDate} />
          </div>
        )}

        {promotion.code && (
          <div className="mb-6 flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20">
            <span className="text-xs sm:text-sm font-medium text-white/70">Use Code:</span>
            <code className="font-bold text-base sm:text-lg tracking-wider">{promotion.code}</code>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70 mb-6">
          <Clock className="h-4 w-4" />
          <span>Valid {format(new Date(promotion.startDate), 'MMM dd')} - {format(new Date(promotion.endDate), 'MMM dd, yyyy')}</span>
        </div>

        <Button className="w-full bg-white text-gray-900 hover:bg-white/90 font-bold text-base h-12 rounded-xl group-hover:shadow-xl transition-all">
          Claim Offer
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}

function isValidDate(date: any): boolean {
  if (!date) return false;
  const parsed = date instanceof Date ? date : new Date(date);
  return !isNaN(parsed.getTime());
}

export function PromotionsSection({ promotions }: PromotionsSectionProps) {
  const now = new Date();
  const activePromotions = promotions.filter(p => {
    if (!p.active || !p.title || !p.description) return false;
    if (!isValidDate(p.startDate) || !isValidDate(p.endDate)) return false;
    
    const startDate = p.startDate instanceof Date ? p.startDate : new Date(p.startDate);
    const endDate = p.endDate instanceof Date ? p.endDate : new Date(p.endDate);
    
    return startDate <= now && endDate >= now;
  });

  if (activePromotions.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-orange-950/20 dark:via-background dark:to-amber-950/20" />
      
      <div className="absolute inset-0 opacity-30 dark:opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal direction="up" className="text-center mb-12 sm:mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-6 py-2 text-sm shadow-lg">
            <TrendingUp className="h-4 w-4 mr-2" />
            Hot Offers
          </Badge>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold mb-4 bg-gradient-to-r from-orange-600 via-red-500 to-amber-600 bg-clip-text text-transparent">
            Special Promotions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Grab these amazing deals before they're gone! Limited time offers crafted just for you.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {activePromotions.map((promotion, index) => (
            <ScrollReveal key={promotion.id} direction="up" delay={index * 0.1}>
              <PromotionCard 
                promotion={promotion} 
                featured={index === 0 && activePromotions.length > 2}
                index={index}
              />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="up" delay={0.4} className="text-center mt-12">
          <AnimatedButton href="/menu" variant="primary" size="lg" className="shadow-xl">
            View All Offers
            <ArrowRight className="ml-2 h-5 w-5" />
          </AnimatedButton>
        </ScrollReveal>
      </div>
    </section>
  );
}
