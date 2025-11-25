'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTransition } from 'react';
import { Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateDescriptionAction } from '../actions';
import { categories } from '@/lib/data';
import type { MenuItem } from '@/types';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  category: z.string().min(1, 'Please select a category.'),
  ingredients: z.string().min(3, 'List at least one ingredient.'),
  description: z.string().optional(),
});

type MenuFormValues = z.infer<typeof formSchema>;

interface MenuFormProps {
  menuItem?: MenuItem;
}

export function MenuForm({ menuItem }: MenuFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const defaultValues = menuItem ? {
    name: menuItem.name,
    price: menuItem.price,
    category: menuItem.category,
    ingredients: menuItem.ingredients.join(', '),
    description: menuItem.description,
  } : {
    name: '',
    price: 0,
    category: '',
    ingredients: '',
    description: '',
  };
  
  const form = useForm<MenuFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleGenerateDescription = () => {
    const { name, category, ingredients } = form.getValues();
    
    startTransition(async () => {
      const result = await generateDescriptionAction({ name, category, ingredients });
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      } else if (result.description) {
        form.setValue('description', result.description);
        toast({
          title: 'Success!',
          description: 'A new description has been generated.',
        });
      }
    });
  };

  function onSubmit(values: MenuFormValues) {
    console.log(values);
    toast({
      title: 'Menu Item Saved!',
      description: `The item "${values.name}" has been saved successfully.`,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Classic Latte" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="ingredients"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ingredients</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List ingredients, separated by commas..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This helps with generating the description and for allergen info.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Description</FormLabel>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleGenerateDescription}
                  disabled={isPending}
                  className="gap-1.5"
                >
                  <Sparkles className="h-4 w-4" />
                  {isPending ? 'Generating...' : 'Generate with AI'}
                </Button>
              </div>
              <FormControl>
                <Textarea
                  placeholder="A delicious and enticing description..."
                  className="min-h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">Save Item</Button>
        </div>
      </form>
    </Form>
  );
}
