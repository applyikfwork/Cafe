'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Book, 
  Calendar, 
  Receipt, 
  Tag, 
  Settings, 
  UtensilsCrossed, 
  PanelLeft,
  Users,
  LogOut,
  Database,
  FolderOpen,
  Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';


const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/menu', label: 'Menu', icon: Book },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/orders', label: 'Orders', icon: Receipt },
  { href: '/admin/promotions', label: 'Promotions', icon: Tag },
  { href: '/admin/staff', label: 'Staff', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/firebase-status', label: 'Firebase Status', icon: Database },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'DELETE',
      });
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully.',
      });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const navContent = (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {adminNavItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            { 'bg-muted text-primary': pathname === item.href }
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-16 items-center border-b px-4 lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold font-headline">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
              <span>Cafe Central</span>
            </Link>
          </div>
          <div className="flex-1">
            {navContent}
          </div>
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-muted/40 px-4 lg:px-6 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <div className="flex h-16 items-center border-b px-4 lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold font-headline">
                  <UtensilsCrossed className="h-6 w-6 text-primary" />
                  <span>Cafe Central</span>
                </Link>
              </div>
              <div className="flex-1">
                {navContent}
              </div>
              <div className="p-4 border-t mt-auto">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex-1 text-center font-headline text-lg font-semibold">
            {adminNavItems.find(item => item.href === pathname)?.label || 'Dashboard'}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
