'use client';

import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function TodaysSpecialBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isVisible) {
    return <div suppressHydrationWarning className="h-0" />;
  }

  return (
    <motion.div
      suppressHydrationWarning
      initial={{ y: mounted ? -100 : 0, opacity: mounted ? 0 : 1 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-[gradient_3s_ease_infinite] text-white py-3 md:py-4 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 flex items-center justify-center gap-2 md:gap-3">
        <Sparkles className="h-4 w-4 md:h-5 md:w-5 animate-pulse-soft flex-shrink-0" />
        <p className="text-xs sm:text-sm md:text-base font-medium text-center line-clamp-2">
          <strong>Today's Special:</strong> Pumpkin Spice Latte + Cinnamon Roll Combo - Only <span className="currency-symbol">₹</span>8.99!
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 hover:bg-white/20 rounded-full p-1 transition-colors flex-shrink-0"
          aria-label="Close banner"
          suppressHydrationWarning
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </motion.div>
  );
}
