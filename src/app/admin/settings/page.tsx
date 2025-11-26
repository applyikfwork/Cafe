'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useSettings } from '@/hooks/useSettings';
import { useTodaysSpecial } from '@/hooks/useTodaysSpecial';
import { updateSettings } from '@/lib/firestore-settings-service';
import { updateTodaysSpecial } from '@/lib/firestore-todays-special-service';
import { useToast } from '@/hooks/use-toast';
import { Upload, Coffee, Image as ImageIcon } from 'lucide-react';

const settingsSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  phone: z.string().min(10),
  email: z.string().email(),
  address: z.string().min(5),
  hoursOpen: z.string(),
  hoursClose: z.string(),
  heroImageUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
  instagramUrl: z.string().url().optional().or(z.literal('')),
  facebookUrl: z.string().url().optional().or(z.literal('')),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function AdminSettingsPage() {
  const { settings, loading: settingsLoading } = useSettings();
  const { special, loading: specialLoading } = useTodaysSpecial();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [heroImagePreview, setHeroImagePreview] = useState<string>('');

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: '',
      description: '',
      phone: '',
      email: '',
      address: '',
      hoursOpen: '',
      hoursClose: '',
      heroImageUrl: '',
      twitterUrl: '',
      instagramUrl: '',
      facebookUrl: '',
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        name: settings.name,
        description: settings.description,
        phone: settings.phone,
        email: settings.email,
        address: settings.address,
        hoursOpen: settings.hours.open,
        hoursClose: settings.hours.close,
        heroImageUrl: settings.heroImageUrl || '',
        twitterUrl: settings.socials?.twitter || '',
        instagramUrl: settings.socials?.instagram || '',
        facebookUrl: settings.socials?.facebook || '',
      });
      setHeroImagePreview(settings.heroImageUrl || '');
    }
  }, [settings, form]);

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'menu_uploads');

      const response = await fetch('https://api.cloudinary.com/v1_1/dqyrrekte/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        setHeroImagePreview(data.secure_url);
        form.setValue('heroImageUrl', data.secure_url);
        toast({
          title: 'Success!',
          description: 'Hero image uploaded successfully.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload hero image.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTodaysSpecial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateTodaysSpecial({
        title: (document.getElementById('special-title') as HTMLInputElement)?.value,
        description: (document.getElementById('special-description') as HTMLInputElement)?.value,
        price: parseFloat((document.getElementById('special-price') as HTMLInputElement)?.value),
        active: (document.getElementById('special-active') as HTMLInputElement)?.checked ?? true,
      });
      
      toast({
        title: 'Success!',
        description: "Today's Special updated successfully.",
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: "Failed to update Today's Special.",
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  async function onSubmit(values: SettingsFormValues) {
    setIsSaving(true);
    try {
      await updateSettings({
        name: values.name,
        description: values.description,
        phone: values.phone,
        email: values.email,
        address: values.address,
        hours: {
          open: values.hoursOpen,
          close: values.hoursClose,
        },
        heroImageUrl: values.heroImageUrl,
        socials: {
          twitter: values.twitterUrl,
          instagram: values.instagramUrl,
          facebook: values.facebookUrl,
        },
      } as any);
      
      toast({
        title: 'Settings Updated!',
        description: 'Your cafe settings have been updated and are live across your website.',
      });
    } catch (error) {
      console.error('Settings update error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (settingsLoading || specialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings & Special</h1>
        <p className="text-muted-foreground">Manage your cafe settings, hero image, and Today's Special</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Hero Image
              </CardTitle>
              <CardDescription>Upload a beautiful hero image for your homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                {heroImagePreview ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                    <img src={heroImagePreview} alt="Hero preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center hover:bg-black/50 transition-all cursor-pointer group">
                      <label className="cursor-pointer w-full h-full flex items-center justify-center">
                        <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload className="h-8 w-8 text-white mx-auto" />
                          <p className="text-sm text-white mt-2">Change Image</p>
                        </div>
                        <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-muted transition-colors block">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Click to upload hero image</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                    <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Today's Special Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-5 w-5" />
                Today's Special
              </CardTitle>
              <CardDescription>Set what appears in the banner at the top of the menu page</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveTodaysSpecial} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Special Item Title</label>
                  <Input
                    id="special-title"
                    defaultValue={special.title}
                    placeholder="e.g., Pumpkin Spice Latte + Combo"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Input
                    id="special-description"
                    defaultValue={special.description}
                    placeholder="e.g., Seasonal favorite with fresh pastry"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Price (₹)</label>
                  <Input
                    id="special-price"
                    type="number"
                    step="0.01"
                    defaultValue={special.price}
                    placeholder="9.99"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Status</label>
                  <button
                    type="button"
                    onClick={(e) => {
                      const checkbox = document.getElementById('special-active') as HTMLInputElement;
                      checkbox.checked = !checkbox.checked;
                      (e.currentTarget as HTMLElement).classList.toggle('bg-green-500/20');
                      (e.currentTarget as HTMLElement).classList.toggle('bg-muted');
                    }}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      special.active
                        ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {special.active ? 'Active' : 'Inactive'}
                  </button>
                  <input id="special-active" type="checkbox" defaultChecked={special.active} className="hidden" />
                </div>
                <Button type="submit" disabled={isSaving} className="w-full">
                  {isSaving ? 'Saving...' : 'Save Today\'s Special'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview Card */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-primary via-accent to-primary text-white p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Coffee className="h-4 w-4" />
                  <span className="font-bold text-xs">Today's Special</span>
                </div>
                <p className="font-bold text-sm">{special.title}</p>
                <p className="text-xs text-white/80 mt-1">{special.description}</p>
                <p className="text-lg font-bold mt-2">
                  <span className="currency-symbol">₹</span>{special.price}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cafe Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Cafe Information</CardTitle>
          <CardDescription>Update your cafe's basic information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" suppressHydrationWarning>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cafe Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>A short tagline for your cafe that appears on the homepage.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="heroImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Homepage Hero Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://images.unsplash.com/..." />
                    </FormControl>
                    <FormDescription>
                      URL for the main image on the homepage. Recommended aspect ratio is 16:9.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hoursOpen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opening Hours</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hoursClose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Closing Hours</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Social Media</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="twitterUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instagramUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="facebookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
