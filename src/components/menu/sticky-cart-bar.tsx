'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface StickyCartBarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart?: () => void;
}

export function StickyCartBar({
  cartCount,
  cartTotal,
  onOpenCart,
}: StickyCartBarProps) {
  if (cartCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden z-40 bg-gradient-to-t from-background via-background to-background/80 border-t-2 border-primary/30 backdrop-blur-md shadow-2xl">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary animate-bounce" />
          <div className="flex flex-col">
            <span className="font-headline font-bold text-sm text-primary">
              {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
            </span>
            <span className="text-xs text-muted-foreground">
              Total: ₹{Math.round(cartTotal)}
            </span>
          </div>
        </div>

        <Button
          asChild
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold rounded-lg px-6 h-10 shadow-lg hover:shadow-xl transition-all"
        >
          <Link href="/menu">Checkout</Link>
        </Button>
      </div>
    </div>
  );
}
