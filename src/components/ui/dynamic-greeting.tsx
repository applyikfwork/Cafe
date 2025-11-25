'use client';

import { useState, useEffect } from 'react';
import { Coffee, Sun, Moon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function DynamicGreeting() {
  const [greeting, setGreeting] = useState({ text: '', icon: Sun });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      setGreeting({ text: 'Good Morning', icon: Coffee });
    } else if (hour >= 12 && hour < 17) {
      setGreeting({ text: 'Good Afternoon', icon: Sun });
    } else if (hour >= 17 && hour < 21) {
      setGreeting({ text: 'Good Evening', icon: Sparkles });
    } else {
      setGreeting({ text: 'Welcome', icon: Moon });
    }
  }, []);

  if (!mounted) {
    return null;
  }

  const Icon = greeting.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="inline-flex items-center gap-2 px-4 py-2 bg-background/20 text-white border border-white/30 rounded-full backdrop-blur-sm mb-4"
    >
      <Icon className="h-4 w-4 animate-pulse-soft" />
      <span className="text-sm font-medium">{greeting.text}!</span>
    </motion.div>
  );
}
