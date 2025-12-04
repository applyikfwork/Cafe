'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ChevronRight, Package } from 'lucide-react';
import Link from 'next/link';
import { Currency } from '@/components/ui/currency';

interface CartItem {
  item: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

interface StickyCartBarProps {
  cartCount: number;
  cartTotal: number;
  cartItems?: CartItem[];
  onOpenCart?: () => void;
}

export function StickyCartBar({
  cartCount,
  cartTotal,
  cartItems = [],
  onOpenCart,
}: StickyCartBarProps) {
  if (cartCount === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-background via-background to-background/95 border-t-2 border-primary/30 backdrop-blur-md shadow-2xl"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <Badge 
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary text-white border-2 border-background"
              >
                {cartCount}
              </Badge>
            </div>
            
            <div className="hidden md:flex flex-col min-w-0">
              <span className="font-headline font-bold text-sm text-primary">
                {cartCount} {cartCount === 1 ? 'Item' : 'Items'} in Cart
              </span>
              <span className="text-xs text-muted-foreground truncate">
                Total: <Currency amount={cartTotal} className="font-semibold text-foreground" />
              </span>
            </div>

            <div className="md:hidden flex flex-col">
              <span className="font-headline font-bold text-sm text-primary">
                {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
              </span>
              <span className="text-xs text-muted-foreground">
                <Currency amount={cartTotal} />
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 flex-1 justify-center overflow-hidden">
            <AnimatePresence mode="popLayout">
              {cartItems.slice(0, 3).map((cartItem, index) => (
                <motion.div
                  key={cartItem.item.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full"
                >
                  <Package className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium truncate max-w-[100px]">
                    {cartItem.item.name}
                  </span>
                  <Badge variant="secondary" className="h-5 min-w-5 p-0 flex items-center justify-center text-[10px]">
                    x{cartItem.quantity}
                  </Badge>
                </motion.div>
              ))}
              {cartItems.length > 3 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-xs text-muted-foreground"
                >
                  +{cartItems.length - 3} more
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden md:flex lg:hidden items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Package className="h-3.5 w-3.5" />
              <span>{cartItems.length} unique items</span>
            </div>
          </div>

          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold rounded-lg px-4 md:px-6 h-10 md:h-11 shadow-lg hover:shadow-xl transition-all flex-shrink-0"
          >
            <Link href="/menu" className="flex items-center gap-2">
              <span className="hidden sm:inline">Proceed to</span>
              <span>Checkout</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
