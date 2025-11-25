'use client';

import { useState } from 'react';
import { usePromotions } from '@/hooks/usePromotions';
import { createPromotion, updatePromotion, deletePromotion } from '@/lib/firestore-promotions-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PromotionForm } from './components/promotion-form';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Tag, Calendar, TrendingUp } from 'lucide-react';
import type { Promotion } from '@/types';
import { format } from 'date-fns';

export default function PromotionsPage() {
  const { promotions, loading } = usePromotions();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activePromotions = promotions.filter(p => p.active && new Date(p.endDate) >= new Date());
  const expiredPromotions = promotions.filter(p => new Date(p.endDate) < new Date());

  async function handleCreatePromotion(values: any) {
    setIsSubmitting(true);
    try {
      await createPromotion({
        ...values,
        startDate: new Date(values.startDate),
        endDate: new Date(values.endDate),
      });
      
      toast({
        title: 'Promotion Created!',
        description: 'Your new promotion has been created successfully.',
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create promotion. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdatePromotion(values: any) {
    if (!editingPromotion) return;
    
    setIsSubmitting(true);
    try {
      await updatePromotion(editingPromotion.id, {
        ...values,
        startDate: new Date(values.startDate),
        endDate: new Date(values.endDate),
      });
      
      toast({
        title: 'Promotion Updated!',
        description: 'Your promotion has been updated successfully.',
      });
      
      setIsDialogOpen(false);
      setEditingPromotion(undefined);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update promotion. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeletePromotion(id: string) {
    try {
      await deletePromotion(id);
      toast({
        title: 'Promotion Deleted',
        description: 'The promotion has been removed.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete promotion. Please try again.',
        variant: 'destructive',
      });
    }
  }

  function getPromotionTypeLabel(type: string) {
    switch (type) {
      case 'percentage':
        return 'Percentage Off';
      case 'fixed':
        return 'Fixed Amount Off';
      case 'bogo':
        return 'Buy One Get One';
      default:
        return type;
    }
  }

  function getPromotionValue(promotion: Promotion) {
    switch (promotion.type) {
      case 'percentage':
        return `${promotion.value}% OFF`;
      case 'fixed':
        return `$${promotion.value} OFF`;
      case 'bogo':
        return `BOGO`;
      default:
        return `${promotion.value}`;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading promotions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl font-headline">Promotions & Specials</h1>
          <p className="text-muted-foreground mt-1">Create and manage promotional campaigns</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPromotion(undefined)}>
              <Plus className="mr-2 h-4 w-4" />
              New Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}
              </DialogTitle>
            </DialogHeader>
            <PromotionForm
              promotion={editingPromotion}
              onSubmit={editingPromotion ? handleUpdatePromotion : handleCreatePromotion}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingPromotion(undefined);
              }}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Promotions</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotions.length}</div>
            <p className="text-xs text-muted-foreground">All time promotions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activePromotions.length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promotions.reduce((sum, p) => sum + (p.usageCount || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Times used</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Promotions</h2>
          {activePromotions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No active promotions</p>
                <p className="text-sm text-muted-foreground mt-1">Create your first promotion to boost sales!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePromotions.map((promotion) => (
                <Card key={promotion.id} className="relative overflow-hidden border-l-4 border-l-green-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{promotion.title}</CardTitle>
                          {promotion.active && (
                            <Badge variant="default" className="bg-green-500">Active</Badge>
                          )}
                        </div>
                        <CardDescription>{promotion.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingPromotion(promotion);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Promotion?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the promotion.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePromotion(promotion.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-green-600">
                        {getPromotionValue(promotion)}
                      </span>
                      <Badge variant="outline">{getPromotionTypeLabel(promotion.type)}</Badge>
                    </div>
                    
                    {promotion.code && (
                      <div className="bg-muted p-2 rounded-md">
                        <p className="text-xs text-muted-foreground">Code:</p>
                        <p className="font-mono font-bold">{promotion.code}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Starts</p>
                        <p className="font-medium">{format(new Date(promotion.startDate), 'MMM dd, yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Ends</p>
                        <p className="font-medium">{format(new Date(promotion.endDate), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    
                    {promotion.usageLimit && (
                      <div className="text-sm">
                        <p className="text-muted-foreground">Usage</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, ((promotion.usageCount || 0) / promotion.usageLimit) * 100)}%`,
                              }}
                            />
                          </div>
                          <span className="font-medium">
                            {promotion.usageCount || 0} / {promotion.usageLimit}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {expiredPromotions.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Expired Promotions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expiredPromotions.map((promotion) => (
                <Card key={promotion.id} className="opacity-60">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{promotion.title}</CardTitle>
                          <Badge variant="secondary">Expired</Badge>
                        </div>
                        <CardDescription>{promotion.description}</CardDescription>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Promotion?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePromotion(promotion.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Ended {format(new Date(promotion.endDate), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Used {promotion.usageCount || 0} times
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
