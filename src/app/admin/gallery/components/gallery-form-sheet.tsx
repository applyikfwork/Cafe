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
import { GalleryForm } from './gallery-form';
import type { GalleryItem } from '@/types';

interface GalleryFormSheetProps {
  children: React.ReactNode;
  galleryItem?: GalleryItem;
}

export function GalleryFormSheet({ children, galleryItem }: GalleryFormSheetProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-headline">
            {galleryItem ? 'Edit Photo' : 'Add New Photo'}
          </SheetTitle>
          <SheetDescription>
            {galleryItem
              ? "Update the details for this gallery photo."
              : "Add a new photo to your gallery. Fill in all the details below."}
          </SheetDescription>
        </SheetHeader>
        <GalleryForm 
          galleryItem={galleryItem}
          onFormSubmit={() => setOpen(false)} 
        />
      </SheetContent>
    </Sheet>
  );
}
