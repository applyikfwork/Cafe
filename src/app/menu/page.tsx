import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-bold">Our Menu</h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our selection of handcrafted dishes, made fresh daily with the finest ingredients.
            </p>
          </div>

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
                {menuItems.map((item) => {
                  const itemImage = PlaceHolderImages.find((img) => img.id === item.imageId);
                  return (
                    <Card key={item.id} className="flex flex-col">
                      <CardHeader className="p-0">
                        {itemImage && (
                          <div className="aspect-video relative">
                            <Image
                              src={itemImage.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover rounded-t-lg"
                              data-ai-hint={itemImage.imageHint}
                            />
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="p-4 flex flex-col flex-1">
                        <h3 className="font-headline text-xl font-semibold">{item.name}</h3>
                        <p className="text-muted-foreground text-sm mt-1 flex-grow">{item.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.tags.map(tag => (
                            <Badge key={tag} variant="outline" className={tagColors[tag]}>{tag}</Badge>
                          ))}
                        </div>

                        <div className="flex justify-between items-end mt-4">
                          <p className="text-lg font-bold text-primary">{formatCurrency(item.price)}</p>
                          <Button size="sm">Add</Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {menuItems.filter(item => item.category === category.id).map((item) => {
                    const itemImage = PlaceHolderImages.find((img) => img.id === item.imageId);
                    return (
                      <Card key={item.id} className="flex flex-col">
                        <CardHeader className="p-0">
                          {itemImage && (
                            <div className="aspect-video relative">
                              <Image
                                src={itemImage.imageUrl}
                                alt={item.name}
                                fill
                                className="object-cover rounded-t-lg"
                                data-ai-hint={itemImage.imageHint}
                              />
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="p-4 flex flex-col flex-1">
                          <h3 className="font-headline text-xl font-semibold">{item.name}</h3>
                          <p className="text-muted-foreground text-sm mt-1 flex-grow">{item.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            {item.tags.map(tag => (
                              <Badge key={tag} variant="outline" className={tagColors[tag]}>{tag}</Badge>
                            ))}
                          </div>
                          
                          <div className="flex justify-between items-end mt-4">
                            <p className="text-lg font-bold text-primary">{formatCurrency(item.price)}</p>
                            <Button size="sm">Add</Button>
                          </div>
                        </CardContent>
                      </Card>
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
