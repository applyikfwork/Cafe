'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { VideoForm } from './video-form';
import type { GalleryVideo } from '@/types';

interface VideoFormSheetProps {
  children: React.ReactNode;
  video?: GalleryVideo;
}

export function VideoFormSheet({ children, video }: VideoFormSheetProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-headline">
            {video ? 'Edit Video' : 'Add New Video'}
          </SheetTitle>
          <SheetDescription>
            {video
              ? "Update the details for this video."
              : "Add a new video to your gallery. Paste a YouTube or video URL."}
          </SheetDescription>
        </SheetHeader>
        <VideoForm 
          video={video}
          onFormSubmit={() => setOpen(false)} 
        />
      </SheetContent>
    </Sheet>
  );
}
