'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useTransition, useRef } from 'react';
import { Sparkles, Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { addMenuItem, updateMenuItem } from '@/lib/firestore-service';
import { uploadMenuImage, formatFileSize, compressImage } from '@/lib/image-utils';
import { useCategories } from '@/hooks/use-categories';

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
  imageId: z.string().optional(),
});

type MenuFormValues = z.infer<typeof formSchema>;

interface MenuFormProps {
  menuItem?: MenuItem;
  onFormSubmit?: () => void;
}

export function MenuForm({ menuItem, onFormSubmit }: MenuFormProps) {
  const { toast } = useToast();
  const { categories, loading: categoriesLoading } = useCategories();
  const [isAiPending, startAiTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(menuItem?.imageUrl || null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Invalid file',
        description: 'Please select an image file.',
      });
      return;
    }

    setSelectedFile(file);
    setIsCompressing(true);

    try {
      if (file.size > 900 * 1024) {
        const compressedBlob = await compressImage(file);
        setCompressedSize(compressedBlob.size);
        const url = URL.createObjectURL(compressedBlob);
        setPreviewUrl(url);
        toast({
          title: 'Image compressed',
          description: `Reduced from ${formatFileSize(file.size)} to ${formatFileSize(compressedBlob.size)}`,
        });
      } else {
        setCompressedSize(file.size);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Compression failed',
        description: error instanceof Error ? error.message : 'Failed to compress image',
      });
      setSelectedFile(null);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(menuItem?.imageUrl || null);
    setCompressedSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(values: MenuFormValues) {
    if (isSaving) return;
    setIsSaving(true);
    
    try {
      let imageUrl = menuItem?.imageUrl || undefined;
      const itemId = menuItem?.id || `item-${Date.now()}`;

      if (selectedFile) {
        toast({
          title: 'Uploading image...',
          description: 'Please wait while we upload your image.',
        });
        
        try {
          const uploadPromise = uploadMenuImage(selectedFile, itemId);
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Image upload timed out. Saving without image.')), 30000)
          );
          
          imageUrl = await Promise.race([uploadPromise, timeoutPromise]);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          toast({
            variant: 'destructive',
            title: 'Image upload failed',
            description: 'Saving menu item without image. You can add the image later.',
          });
          imageUrl = undefined;
        }
      }

      const itemData = {
        ...values,
        ingredients: values.ingredients.split(',').map(s => s.trim()).filter(Boolean),
        tags: (values.tags || []) as ("veg" | "spicy" | "gluten-free" | "new")[],
        imageUrl,
      };
      
      if (menuItem) {
        await updateMenuItem(menuItem.id, itemData as Partial<MenuItem>);
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
        setSelectedFile(null);
        setPreviewUrl(null);
        setCompressedSize(null);
      }
      onFormSubmit?.();
    } catch (error) {
      console.error('Failed to save menu item', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: error instanceof Error ? error.message : 'Could not save the menu item.',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
        <div className="space-y-4">
          <FormLabel>Item Image</FormLabel>
          <div className="flex flex-col gap-4">
            {previewUrl ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border bg-muted">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
                {compressedSize && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {formatFileSize(compressedSize)}
                  </div>
                )}
              </div>
            ) : (
              <div 
                className="w-full h-48 rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-muted-foreground/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {isCompressing ? (
                  <>
                    <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
                    <p className="text-sm text-muted-foreground">Compressing image...</p>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload image</p>
                    <p className="text-xs text-muted-foreground">Images over 900KB will be compressed</p>
                  </>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            {!previewUrl && (
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Select Image
              </Button>
            )}
          </div>
          <FormDescription>
            Upload a dish image. Images larger than 900KB will be automatically compressed to fit Firebase free tier limits.
          </FormDescription>
        </div>

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
                <FormLabel>Price (INR)</FormLabel>
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
                      <SelectValue placeholder={categoriesLoading ? "Loading..." : "Select a category"} />
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
          <Button type="submit" disabled={isSaving || isCompressing}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : 'Save Item'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
