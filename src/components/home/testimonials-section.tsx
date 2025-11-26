'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Coffee Enthusiast',
    image: '👩‍💼',
    rating: 5,
    text: 'Best coffee in the city! The ambiance is perfect and staff is super friendly. I visit every morning!',
  },
  {
    name: 'Michael Chen',
    role: 'Food Blogger',
    image: '👨‍💻',
    rating: 5,
    text: 'Their pastries are absolutely incredible. Fresh, delicious, and the presentation is stunning. Highly recommend!',
  },
  {
    name: 'Priya Sharma',
    role: 'Regular Customer',
    image: '👩‍🎨',
    rating: 5,
    text: 'Love the variety! Every item on the menu is crafted with care. It\'s not just food, it\'s an experience.',
  },
  {
    name: 'David Martinez',
    role: 'Student',
    image: '👨‍🎓',
    rating: 5,
    text: 'Perfect study spot with amazing drinks. The WiFi is fast and the vibes are immaculate!',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal direction="up" className="text-center mb-12 md:mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-1 mx-auto">
            <Star className="h-3 w-3 mr-1" />
            Love from Our Customers
          </Badge>
          <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4">
            What People Say About Us
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Join thousands of satisfied customers who've made us their favorite cafe
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 0.1}>
              <Card className="h-full bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{testimonial.image}</div>
                    <div>
                      <p className="font-bold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {Array(testimonial.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                    "{testimonial.text}"
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
