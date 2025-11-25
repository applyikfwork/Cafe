'use client';

import { useEffect, useState } from 'react';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { MenuFormSheet } from './components/menu-form-sheet';
import { useMenuItems } from '@/hooks/useMenuItems';
import { deleteMenuItem } from '@/lib/firestore-service';
import { categories } from '@/lib/data';

export default function AdminMenuPage() {
  const { items: menuItems } = useMenuItems();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setIsDeleting(id);
      try {
        await deleteMenuItem(id);
      } catch (error) {
        console.error('Error deleting item:', error);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl font-headline">Menu</h1>
          <p className="text-sm text-muted-foreground">Manage your cafe's menu items in real-time.</p>
        </div>
        <MenuFormSheet>
          <Button size="sm" className="h-7 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Item
            </span>
          </Button>
        </MenuFormSheet>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Menu Items ({menuItems.length})</CardTitle>
          <CardDescription>
            All items are updated in real-time across your website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.map((item) => {
                const category = categories.find(c => c.id === item.category);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{category?.name || 'Uncategorized'}</TableCell>
                    <TableCell>{formatCurrency(item.price)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {item.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <MenuFormSheet menuItem={item}>
                          <Button variant="ghost" size="sm" className="h-7">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </MenuFormSheet>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(item.id)}
                          disabled={isDeleting === item.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
