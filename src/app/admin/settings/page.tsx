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
import { updateSettings } from '@/lib/firestore-settings-service';
import { useToast } from '@/hooks/use-toast';

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
  const { settings, loading } = useSettings();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

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
        twitterUrl: settings.socials.twitter,
        instagramUrl: settings.socials.instagram,
        facebookUrl: settings.socials.facebook,
      });
    }
  }, [settings, form]);

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

  if (loading) {
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
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your cafe's information. Changes are live immediately.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cafe Information</CardTitle>
          <CardDescription>Update your cafe's basic information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
