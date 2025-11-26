'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTransition } from 'react';
import { Sparkles } from 'lucide-react';
import { addMenuItem, updateMenuItem } from '@/lib/firestore-service';

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
import { Checkbox } from '@/components/ui/checkbox';
import { tags as availableTags } from '@/types';


const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  category: z.string().min(1, 'Please select a category.'),
  ingredients: z.string().min(3, 'List at least one ingredient.'),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  imageId: z.string().optional(), // You might want to add a way to select images
});

type MenuFormValues = z.infer<typeof formSchema>;

interface MenuFormProps {
  menuItem?: MenuItem;
  onFormSubmit?: () => void;
}

export function MenuForm({ menuItem, onFormSubmit }: MenuFormProps) {
  const { toast } = useToast();
  const [isAiPending, startAiTransition] = useTransition();
  const [isSubmitPending, startSubmitTransition] = useTransition();

  const defaultValues = menuItem ? {
    name: menuItem.name,
    price: menuItem.price,
    category: menuItem.category,
    ingredients: menuItem.ingredients.join(', '),
    description: menuItem.description,
    tags: menuItem.tags,
    imageId: menuItem.imageId
  } : {
    name: '',
    price: 0,
    category: '',
    ingredients: '',
    description: '',
    tags: [],
    imageId: 'placeholder'
  };
  
  const form = useForm<MenuFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleGenerateDescription = () => {
    const { name, category, ingredients } = form.getValues();
    
    startAiTransition(async () => {
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

  async function onSubmit(values: MenuFormValues) {
    const itemData = {
      ...values,
      ingredients: values.ingredients.split(',').map(s => s.trim()).filter(Boolean),
      tags: values.tags || [],
    };
    
    startSubmitTransition(async () => {
      try {
        if (menuItem) {
          await updateMenuItem(menuItem.id, itemData);
          toast({
            title: 'Menu Item Updated!',
            description: `The item "${values.name}" has been updated successfully.`,
          });
        } else {
          await addMenuItem(itemData as Omit<MenuItem, 'id'>);
          toast({
            title: 'Menu Item Added!',
            description: `The item "${values.name}" has been added successfully.`,
          });
          form.reset();
        }
        onFormSubmit?.();
      } catch (error) {
        console.error('Failed to save menu item', error);
        toast({
          variant: 'destructive',
          title: 'Save Failed',
          description: error instanceof Error ? error.message : 'Could not save the menu item.',
        });
      }
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
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
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
          name="tags"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Tags</FormLabel>
                <FormDescription>
                  Select tags that apply to this menu item.
                </FormDescription>
              </div>
              <div className="flex flex-wrap gap-4">
                {availableTags.map((tag) => (
                  <FormField
                    key={tag}
                    control={form.control}
                    name="tags"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={tag}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(tag)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), tag])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== tag
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {tag}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
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
                  disabled={isAiPending}
                  className="gap-1.5"
                >
                  <Sparkles className="h-4 w-4" />
                  {isAiPending ? 'Generating...' : 'Generate with AI'}
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
          <Button type="submit" disabled={isSubmitPending}>
            {isSubmitPending ? 'Saving...' : 'Save Item'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
