'use client';

import { UtensilsCrossed, Twitter, Instagram, Facebook, Mail, MapPin, Phone, Clock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function Footer() {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  return (
    <footer className="bg-gradient-to-br from-muted/60 to-muted/30 border-t">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center space-x-2 mb-4 group">
              <UtensilsCrossed className="h-8 w-8 text-primary transition-transform group-hover:rotate-12" />
              <span className="text-xl font-bold font-headline group-hover:text-primary transition-colors">
                Cafe Central Station
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your favorite spot for coffee, comfort, and community since 2010.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-xs"><strong>Open:</strong> 7am - 9pm Daily</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-headline font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/menu', label: 'Menu' },
                { href: '#', label: 'Book a Table' },
                { href: '#', label: 'About Us' },
                { href: '/admin', label: 'Admin Login' }
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-headline font-semibold mb-4 text-lg">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2 hover:text-primary transition-colors">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                <span>123 Central Street<br/>Food City, FC 12345</span>
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                <a href="tel:+15551234567">(555) 123-4567</a>
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                <a href="mailto:hello@cafecentral.station">hello@cafecentral.station</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline font-semibold mb-4 text-lg">Follow Us</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Join our community for daily specials and updates!
            </p>
            <div className="flex space-x-3">
              {[
                { Icon: Twitter, name: 'twitter', href: 'https://twitter.com' },
                { Icon: Instagram, name: 'instagram', href: 'https://instagram.com' },
                { Icon: Facebook, name: 'facebook', href: 'https://facebook.com' }
              ].map(({ Icon, name, href }) => (
                <Link 
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative p-2 rounded-full bg-primary/10 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                  onMouseEnter={() => setHoveredSocial(name)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  aria-label={`Follow us on ${name}`}
                >
                  <Icon size={20} />
                  {hoveredSocial === name && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap">
                      {name}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Cafe Central Station. All rights reserved. Made with ❤️ and ☕
          </p>
        </div>
      </div>
    </footer>
  );
}
