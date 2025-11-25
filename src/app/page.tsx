import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { menuItems } from '@/lib/data';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-cafe');
  const featuredItems = menuItems.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="relative w-full h-[60vh] md:h-[80vh] text-white">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative h-full flex flex-col items-center justify-center text-center p-4">
            <Badge
              variant="outline"
              className="bg-background/20 text-white border-white mb-4 backdrop-blur-sm"
            >
              Now Open!
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight drop-shadow-lg">
              Cafe Central Station
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-stone-200 drop-shadow-md">
              Where every cup tells a story and every bite feels like home.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/menu">Order Now</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="#">Reserve a Table</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">
                Our Specialties
              </h2>
              <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
                Discover the flavors that our regulars rave about. Handcrafted with love and the finest ingredients.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.map((item) => {
                const itemImage = PlaceHolderImages.find((img) => img.id === item.imageId);
                return (
                  <Card key={item.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="p-0">
                      {itemImage && (
                        <div className="aspect-video relative">
                          <Image
                            src={itemImage.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            data-ai-hint={itemImage.imageHint}
                          />
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="p-6">
                      <CardTitle className="font-headline text-2xl">{item.name}</CardTitle>
                      <p className="text-muted-foreground mt-2 text-sm">{item.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-xl font-bold text-primary">${item.price.toFixed(2)}</p>
                        <Button variant="outline">Add to Order</Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="text-center mt-12">
              <Button asChild size="lg" variant="link" className="text-accent text-lg">
                <Link href="/menu">View Full Menu &rarr;</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
