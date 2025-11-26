'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Users, Award, Coffee, Sparkles } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '5K+',
    label: 'Happy Customers',
    description: 'Joining us daily',
  },
  {
    icon: Coffee,
    value: '50+',
    label: 'Menu Items',
    description: 'Handcrafted recipes',
  },
  {
    icon: Award,
    value: '4.9★',
    label: 'Rating',
    description: 'From 1000+ reviews',
  },
  {
    icon: Sparkles,
    value: '10+',
    label: 'Years',
    description: 'Of excellence',
  },
];

export function StatsSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal direction="up" className="text-center mb-12 md:mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1 mx-auto">
            By The Numbers
          </Badge>
          <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4">
            A Cafe Built on Trust
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-white/50 dark:from-white/5 to-white/20 dark:to-white/10 backdrop-blur-sm border border-white/20 hover:border-primary/50 transition-all hover:shadow-lg">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4 mx-auto">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-primary mb-1">
                    {stat.value}
                  </p>
                  <p className="font-semibold text-sm md:text-base">{stat.label}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
