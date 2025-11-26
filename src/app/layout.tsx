import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cafe Central Station | Premium Cafe Menu & Delicious Dishes',
  description: 'Discover our handcrafted cafe menu with artisan coffee, fresh pastries, and delicious meals. Premium quality ingredients, fast service. Order online now!',
  keywords: 'cafe menu, coffee shop, pastries, breakfast, lunch, cafe near me, premium cafe',
  authors: [{ name: 'Cafe Central Station' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    title: 'Cafe Central Station | Premium Cafe Menu',
    description: 'Discover our handcrafted cafe menu with artisan coffee, fresh pastries, and delicious meals.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&family=Source+Code+Pro:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
