'use client';

import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'lg';
  className?: string;
  href?: string;
}

export function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'default',
  className = '',
  href
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = cn(
    'relative overflow-hidden font-medium transition-all duration-300 rounded-lg inline-flex items-center justify-center',
    size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-3',
    variant === 'primary'
      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
      : 'bg-secondary text-secondary-foreground hover:bg-secondary/90 border-2 border-white/30',
    className
  );

  const ButtonContent = (
    <>
      <motion.span
        className="relative z-10"
        animate={{
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
      
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '100%' : '-100%' }}
        transition={{ duration: 0.6 }}
      />

      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 opacity-0"
          animate={{
            opacity: isHovered ? [0, 0.3, 0] : 0,
          }}
          transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
          }}
        />
      )}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={baseClasses}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {ButtonContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={baseClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {ButtonContent}
    </motion.button>
  );
}
