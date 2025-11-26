'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Coffee, Calendar, Phone } from 'lucide-react';
import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background via-muted/10 to-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Now */}
          <ScrollReveal direction="up" delay={0}>
            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 bg-gradient-to-br from-primary/10 to-primary/5 hover:shadow-2xl transition-all h-full p-6 md:p-8">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full group-hover:scale-150 transition-transform" />
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6 mx-auto group-hover:bg-primary/30 transition-all">
                  <Coffee className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Order Online</h3>
                <p className="text-muted-foreground mb-6">
                  Browse our menu and order your favorite items instantly
                </p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  <Link href="/menu">View Menu</Link>
                </Button>
              </div>
            </Card>
          </ScrollReveal>

          {/* Reserve Table */}
          <ScrollReveal direction="up" delay={0.1}>
            <Card className="group relative overflow-hidden border-2 hover:border-accent/50 bg-gradient-to-br from-accent/10 to-accent/5 hover:shadow-2xl transition-all h-full p-6 md:p-8">
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/20 rounded-full group-hover:scale-150 transition-transform" />
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-6 mx-auto group-hover:bg-accent/30 transition-all">
                  <Calendar className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Reserve a Table</h3>
                <p className="text-muted-foreground mb-6">
                  Book your perfect spot and enjoy quality time with us
                </p>
                <Button
                  variant="outline"
                  className="w-full border-2 hover:bg-accent/10"
                >
                  Book Now
                </Button>
              </div>
            </Card>
          </ScrollReveal>

          {/* Contact Us */}
          <ScrollReveal direction="up" delay={0.2}>
            <Card className="group relative overflow-hidden border-2 hover:border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-orange-500/5 hover:shadow-2xl transition-all h-full p-6 md:p-8">
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange-500/20 rounded-full group-hover:scale-150 transition-transform" />
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 mb-6 mx-auto group-hover:bg-orange-500/30 transition-all">
                  <Phone className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Get in Touch</h3>
                <p className="text-muted-foreground mb-6">
                  Questions? Call us or visit our cafe for more info
                </p>
                <Button
                  variant="outline"
                  className="w-full border-2 hover:bg-orange-500/10"
                >
                  Contact Us
                </Button>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
