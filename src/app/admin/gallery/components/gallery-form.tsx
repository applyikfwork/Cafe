'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { addGalleryItem, updateGalleryItem } from '@/lib/firestore-gallery-service';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { formatFileSize, compressImage } from '@/lib/image-utils';

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
import type { GalleryItem, GalleryCategory } from '@/types';

const galleryCategories: { value: GalleryCategory; label: string }[] = [
  { value: 'food', label: 'Food & Drinks' },
  { value: 'ambiance', label: 'Ambiance' },
  { value: 'events', label: 'Events' },
  { value: 'behind-the-scenes', label: 'Behind the Scenes' },
];

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  description: z.string().optional(),
  category: z.enum(['ambiance', 'food', 'events', 'behind-the-scenes']),
  isContest: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  active: z.boolean().default(true),
  submittedBy: z.string().optional(),
  submitterEmail: z.string().email().optional().or(z.literal('')),
});

type GalleryFormValues = z.infer<typeof formSchema>;

interface GalleryFormProps {
  galleryItem?: GalleryItem;
  onFormSubmit?: () => void;
}

export function GalleryForm({ galleryItem, onFormSubmit }: GalleryFormProps) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(galleryItem?.imageUrl || null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultValues: GalleryFormValues = galleryItem ? {
    title: galleryItem.title,
    description: galleryItem.description || '',
    category: galleryItem.category,
    isContest: galleryItem.isContest || false,
    isFeatured: galleryItem.isFeatured || false,
    active: galleryItem.active !== false,
    submittedBy: galleryItem.submittedBy || '',
    submitterEmail: galleryItem.submitterEmail || '',
  } : {
    title: '',
    description: '',
    category: 'food',
    isContest: false,
    isFeatured: false,
    active: true,
    submittedBy: '',
    submitterEmail: '',
  };

  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const isContest = form.watch('isContest');

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
    setPreviewUrl(galleryItem?.imageUrl || null);
    setCompressedSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  async function onSubmit(values: GalleryFormValues) {
    if (isSaving) return;
    
    if (!galleryItem && !selectedFile && !previewUrl) {
      toast({
        variant: 'destructive',
        title: 'Image required',
        description: 'Please upload an image for the gallery.',
      });
      return;
    }

    setIsSaving(true);

    try {
      let imageUrl: string | undefined = galleryItem?.imageUrl;

      if (selectedFile) {
        toast({
          title: 'Uploading image...',
          description: 'Please wait while we upload your image.',
        });
        
        try {
          imageUrl = await uploadToCloudinary(selectedFile);
          toast({
            title: 'Image uploaded!',
            description: 'Image uploaded successfully.',
          });
        } catch (uploadError) {
          toast({
            variant: 'destructive',
            title: 'Image upload failed',
            description: uploadError instanceof Error ? uploadError.message : 'Unknown error',
          });
          setIsSaving(false);
          return;
        }
      }

      const itemData: Omit<GalleryItem, 'id'> = {
        title: values.title,
        description: values.description,
        imageUrl: imageUrl || '',
        category: values.category,
        isContest: values.isContest,
        isFeatured: values.isFeatured,
        active: values.active,
        submittedBy: values.submittedBy,
        submitterEmail: values.submitterEmail,
        likes: galleryItem?.likes || 0,
        views: galleryItem?.views || 0,
        createdAt: galleryItem?.createdAt || new Date(),
      };

      if (galleryItem) {
        await updateGalleryItem(galleryItem.id, itemData);
        toast({
          title: 'Photo Updated!',
          description: `"${values.title}" has been updated.`,
        });
      } else {
        await addGalleryItem(itemData);
        toast({
          title: 'Photo Added!',
          description: `"${values.title}" has been added to the gallery.`,
        });
        form.reset();
        setSelectedFile(null);
        setPreviewUrl(null);
        setCompressedSize(null);
      }
      onFormSubmit?.();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: error instanceof Error ? error.message : 'Could not save the gallery item.',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
        <div className="space-y-4">
          <FormLabel>Photo</FormLabel>
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
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Morning Coffee Ritual" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe this photo..."
                  className="min-h-20"
                  {...field}
                />
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
                  {galleryCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="isContest"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Contest Submission</FormLabel>
                  <FormDescription>
                    Mark this as a customer-submitted contest photo
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
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Featured</FormLabel>
                  <FormDescription>
                    Highlight this photo in the gallery
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
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Visible</FormLabel>
                  <FormDescription>
                    Show this photo in the public gallery
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

        {isContest && (
          <div className="space-y-4 p-4 rounded-lg bg-muted/50">
            <h4 className="font-medium">Submitter Information</h4>
            <FormField
              control={form.control}
              name="submittedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Customer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="submitterEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="customer@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving || isCompressing}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : galleryItem ? 'Update Photo' : 'Add Photo'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
