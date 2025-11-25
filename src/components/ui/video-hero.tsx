'use client';

import { ReactNode } from 'react';

interface VideoHeroProps {
  videoSrc?: string;
  fallbackImage: string;
  children: ReactNode;
  className?: string;
}

export function VideoHero({ videoSrc, fallbackImage, children, className = '' }: VideoHeroProps) {
  return (
    <section className={`relative w-full h-[60vh] md:h-[80vh] text-white overflow-hidden ${className}`}>
      {videoSrc ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster={fallbackImage}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${fallbackImage})` }}
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      
      <div className="relative h-full z-10">
        {children}
      </div>
    </section>
  );
}
