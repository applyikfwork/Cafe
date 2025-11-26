'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MenuForm } from './menu-form';
import type { MenuItem } from '@/types';
import { useState } from 'react';

interface MenuFormSheetProps {
  children: React.ReactNode;
  menuItem?: MenuItem;
}

export function MenuFormSheet({ children, menuItem }: MenuFormSheetProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-headline">
            {menuItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </SheetTitle>
          <SheetDescription>
            {menuItem
              ? "Update the details for this item."
              : "Fill in the details for your new menu item. Click 'Generate' to create a description with AI."}
          </SheetDescription>
        </SheetHeader>
        <MenuForm 
          menuItem={menuItem}
          onFormSubmit={() => setOpen(false)} 
        />
      </SheetContent>
    </Sheet>
  );
}
