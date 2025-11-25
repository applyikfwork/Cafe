import { UtensilsCrossed, Twitter, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-muted/40">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <UtensilsCrossed className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline">Cafe Central Station</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your favorite spot for coffee, comfort, and community.
            </p>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/menu" className="text-sm text-muted-foreground hover:text-primary">Menu</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Book a Table</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/admin" className="text-sm text-muted-foreground hover:text-primary">Admin Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>123 Cafe Lane, Food City</li>
              <li>(123) 456-7890</li>
              <li>hello@cafecentral.station</li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram size={20} /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook size={20} /></Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Cafe Central Station. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
