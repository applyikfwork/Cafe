import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { TodaysSpecialBanner } from '@/components/ui/todays-special-banner';
import { categories, menuItems } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Tag } from '@/types';

const tagColors: Record<Tag, string> = {
  veg: 'border-green-500/80 bg-green-500/10 text-green-700 dark:text-green-400',
  spicy: 'border-red-500/80 bg-red-500/10 text-red-700 dark:text-red-400',
  'gluten-free': 'border-blue-500/80 bg-blue-500/10 text-blue-700 dark:text-blue-400',
  new: 'border-yellow-500/80 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
};

export default function MenuPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <TodaysSpecialBanner />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <ScrollReveal direction="up" className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-slide-down">
              Our Menu
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our selection of handcrafted dishes, made fresh daily with the finest ingredients.
            </p>
          </ScrollReveal>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-flow-col">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {menuItems.map((item, index) => {
                  const itemImage = PlaceHolderImages.find((img) => img.id === item.imageId);
                  return (
                    <ScrollReveal key={item.id} direction="up" delay={index * 0.05}>
                      <Card className="group flex flex-col h-full hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 overflow-hidden">
                        <CardHeader className="p-0 relative overflow-hidden">
                          {itemImage && (
                            <div className="aspect-video relative">
                              <Image
                                src={itemImage.imageUrl}
                                alt={item.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                className="object-cover rounded-t-lg transition-transform duration-700 group-hover:scale-110"
                                data-ai-hint={itemImage.imageHint}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="p-4 flex flex-col flex-1">
                          <h3 className="font-headline text-xl font-semibold group-hover:text-primary transition-colors">{item.name}</h3>
                          <p className="text-muted-foreground text-sm mt-1 flex-grow leading-relaxed">{item.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            {item.tags.map(tag => (
                              <Badge key={tag} variant="outline" className={`${tagColors[tag]} transition-all group-hover:scale-105`}>
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex justify-between items-end mt-4">
                            <p className="text-2xl font-bold text-primary">{formatCurrency(item.price)}</p>
                            <Button 
                              size="sm" 
                              className="group-hover:bg-primary group-hover:scale-105 transition-all"
                            >
                              Add
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </ScrollReveal>
                  );
                })}
              </div>
            </TabsContent>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {menuItems.filter(item => item.category === category.id).map((item, index) => {
                    const itemImage = PlaceHolderImages.find((img) => img.id === item.imageId);
                    return (
                      <ScrollReveal key={item.id} direction="up" delay={index * 0.05}>
                        <Card className="group flex flex-col h-full hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 overflow-hidden">
                          <CardHeader className="p-0 relative overflow-hidden">
                            {itemImage && (
                              <div className="aspect-video relative">
                                <Image
                                  src={itemImage.imageUrl}
                                  alt={item.name}
                                  fill
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                  className="object-cover rounded-t-lg transition-transform duration-700 group-hover:scale-110"
                                  data-ai-hint={itemImage.imageHint}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              </div>
                            )}
                          </CardHeader>
                          <CardContent className="p-4 flex flex-col flex-1">
                            <h3 className="font-headline text-xl font-semibold group-hover:text-primary transition-colors">{item.name}</h3>
                            <p className="text-muted-foreground text-sm mt-1 flex-grow leading-relaxed">{item.description}</p>
                          
                            <div className="flex flex-wrap gap-2 mt-3">
                              {item.tags.map(tag => (
                                <Badge key={tag} variant="outline" className={`${tagColors[tag]} transition-all group-hover:scale-105`}>
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex justify-between items-end mt-4">
                              <p className="text-2xl font-bold text-primary">{formatCurrency(item.price)}</p>
                              <Button 
                                size="sm" 
                                className="group-hover:bg-primary group-hover:scale-105 transition-all"
                              >
                                Add
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </ScrollReveal>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
