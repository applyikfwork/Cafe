'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useTransition, useRef } from 'react';
import { Sparkles, Upload, X, ImageIcon, Loader2, Wand2, Star, Users, Clock, Flame, TrendingUp, Award } from 'lucide-react';
import { addMenuItem, updateMenuItem } from '@/lib/firestore-service';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { formatFileSize, compressImage } from '@/lib/image-utils';
import { useCategories } from '@/hooks/use-categories';
import { generateCompleteFakeSocialProof } from '@/lib/fake-data-generator';

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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { generateDescriptionAction } from '../actions';
import type { MenuItem, SpiceLevel, DietaryPreference, Review } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { tags as availableTags, spiceLevels, dietaryPreferences } from '@/types';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
  category: z.string().min(1, 'Please select a category.'),
  ingredients: z.string().min(3, 'List at least one ingredient.'),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  imageId: z.string().optional(),
  prepTime: z.coerce.number().min(0).optional(),
  calories: z.coerce.number().min(0).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviewCount: z.coerce.number().min(0).optional(),
  totalBuyers: z.coerce.number().min(0).optional(),
  orderCount: z.coerce.number().min(0).optional(),
  spiceLevel: z.enum(['mild', 'medium', 'hot', 'extra-hot']).optional().nullable(),
  dietary: z.array(z.string()).optional(),
  isPopular: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
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
  const [generatedReviews, setGeneratedReviews] = useState<Review[]>(menuItem?.reviews || []);
  const [isGeneratingSocialProof, setIsGeneratingSocialProof] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultValues = menuItem ? {
    name: menuItem.name,
    price: menuItem.price,
    category: menuItem.category,
    ingredients: menuItem.ingredients.join(', '),
    description: menuItem.description,
    tags: menuItem.tags,
    imageId: menuItem.imageId,
    prepTime: menuItem.prepTime || 0,
    calories: menuItem.calories || 0,
    rating: menuItem.rating || 0,
    reviewCount: menuItem.reviewCount || 0,
    totalBuyers: menuItem.totalBuyers || 0,
    orderCount: menuItem.orderCount || 0,
    spiceLevel: menuItem.spiceLevel || null,
    dietary: menuItem.dietary || [],
    isPopular: menuItem.isPopular || false,
    isTrending: menuItem.isTrending || false,
    isBestSeller: menuItem.isBestSeller || false,
  } : {
    name: '',
    price: 0,
    category: '',
    ingredients: '',
    description: '',
    tags: [],
    imageId: 'placeholder',
    prepTime: 0,
    calories: 0,
    rating: 0,
    reviewCount: 0,
    totalBuyers: 0,
    orderCount: 0,
    spiceLevel: null,
    dietary: [],
    isPopular: false,
    isTrending: false,
    isBestSeller: false,
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

  const handleGenerateSocialProof = () => {
    setIsGeneratingSocialProof(true);
    const { category } = form.getValues();
    const itemId = menuItem?.id || `temp-${Date.now()}`;
    
    try {
      const socialProof = generateCompleteFakeSocialProof(itemId, category || 'main-courses', 5);
      
      form.setValue('rating', socialProof.rating);
      form.setValue('reviewCount', socialProof.reviewCount);
      form.setValue('totalBuyers', socialProof.totalBuyers);
      form.setValue('orderCount', socialProof.orderCount);
      form.setValue('prepTime', socialProof.prepTime);
      form.setValue('calories', socialProof.calories);
      form.setValue('isPopular', socialProof.isPopular);
      form.setValue('isTrending', socialProof.isTrending);
      form.setValue('isBestSeller', socialProof.isBestSeller);
      if (socialProof.spiceLevel) {
        form.setValue('spiceLevel', socialProof.spiceLevel);
      }
      if (socialProof.dietary.length > 0) {
        form.setValue('dietary', socialProof.dietary);
      }
      
      setGeneratedReviews(socialProof.reviews);
      
      toast({
        title: 'Social Proof Generated!',
        description: `Added ${socialProof.reviewCount} reviews, ${socialProof.totalBuyers.toLocaleString()} buyers, and more.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate social proof data.',
      });
    } finally {
      setIsGeneratingSocialProof(false);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(values: MenuFormValues) {
    if (isSaving) return;
    setIsSaving(true);
    
    try {
      let imageUrl: string | undefined = menuItem?.imageUrl;
      const itemId = menuItem?.id || `item-${Date.now()}`;

      if (selectedFile) {
        console.log('Starting image upload to Cloudinary:', selectedFile.name, 'Size:', selectedFile.size);
        toast({
          title: 'Uploading image...',
          description: 'Please wait while we upload your image.',
        });
        
        try {
          imageUrl = await uploadToCloudinary(selectedFile);
          console.log('Image uploaded successfully to Cloudinary:', imageUrl);
          toast({
            title: 'Image uploaded!',
            description: 'Image uploaded successfully.',
          });
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          const errorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown error';
          toast({
            variant: 'destructive',
            title: 'Image upload failed',
            description: errorMessage,
          });
          setIsSaving(false);
          return;
        }
      }

      console.log('Saving menu item with data:', {
        name: values.name,
        hasImage: !!imageUrl,
        imageUrl: imageUrl
      });

      const itemData: any = {
        ...values,
        ingredients: values.ingredients.split(',').map(s => s.trim()).filter(Boolean),
        tags: (values.tags || []) as ("veg" | "spicy" | "gluten-free" | "new")[],
        dietary: (values.dietary || []) as DietaryPreference[],
        spiceLevel: values.spiceLevel || undefined,
        reviews: generatedReviews.length > 0 ? generatedReviews : undefined,
      };
      
      if (imageUrl) {
        itemData.imageUrl = imageUrl;
      }
      
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
        setGeneratedReviews([]);
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

        <Separator className="my-6" />

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="social-proof">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Social Proof & Details</span>
                {(form.watch('rating') || form.watch('totalBuyers')) && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({form.watch('rating')?.toFixed(1) || 0}★ • {form.watch('totalBuyers')?.toLocaleString() || 0} buyers)
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border">
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    <Wand2 className="h-4 w-4" />
                    Auto-Generate Social Proof
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Generate realistic reviews, buyer counts, and more
                  </p>
                </div>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleGenerateSocialProof}
                  disabled={isGeneratingSocialProof}
                  className="gap-2"
                >
                  {isGeneratingSocialProof ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  Generate All
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Rating
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" min="0" max="5" placeholder="4.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reviewCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Count</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="120" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="totalBuyers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Total Buyers
                      </FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="1500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="orderCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Count</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="2500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="prepTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Prep Time (mins)
                      </FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="15" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="calories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-orange-500" />
                        Calories
                      </FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="350" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="spiceLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spice Level</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select spice level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {spiceLevels.map((level) => (
                          <SelectItem key={level} value={level} className="capitalize">
                            {level.replace('-', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dietary"
                render={() => (
                  <FormItem>
                    <FormLabel>Dietary Preferences</FormLabel>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {dietaryPreferences.map((pref) => (
                        <FormField
                          key={pref}
                          control={form.control}
                          name="dietary"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(pref)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), pref])
                                      : field.onChange(
                                          field.value?.filter((v) => v !== pref)
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal capitalize text-sm">
                                {pref.replace('-', ' ')}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="isPopular"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          Popular
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Mark as a popular item
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isTrending"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="flex items-center gap-2">
                          <Flame className="h-4 w-4 text-orange-500" />
                          Trending
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Show in trending section
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isBestSeller"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-yellow-500" />
                          Best Seller
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Display best seller badge
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {generatedReviews.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Generated Reviews ({generatedReviews.length})</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {generatedReviews.map((review) => (
                      <div key={review.id} className="p-3 rounded-lg bg-muted/50 text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{review.reviewerName}</span>
                          <div className="flex text-yellow-500">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current" />
                            ))}
                          </div>
                          {review.isVerified && (
                            <span className="text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded">Verified</span>
                          )}
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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
