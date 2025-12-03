'use client';

import { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Image as ImageIcon, 
  Video, 
  Trophy, 
  Star,
  Eye,
  Heart,
  Trash2,
  Edit,
  MoreHorizontal,
  Camera,
  Loader2
} from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { GalleryFormSheet } from './components/gallery-form-sheet';
import { VideoFormSheet } from './components/video-form-sheet';
import { 
  subscribeToGalleryItems, 
  subscribeToGalleryVideos,
  subscribeToContestPhotos,
  deleteGalleryItem,
  deleteGalleryVideo,
  setPhotoOfDay,
  getGalleryStats,
} from '@/lib/firestore-gallery-service';
import type { GalleryItem, GalleryVideo, GalleryStats } from '@/types';
import { format } from 'date-fns';

export default function AdminGalleryPage() {
  const { toast } = useToast();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [contestPhotos, setContestPhotos] = useState<GalleryItem[]>([]);
  const [stats, setStats] = useState<GalleryStats | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('photos');

  useEffect(() => {
    const unsubGallery = subscribeToGalleryItems(setGalleryItems);
    const unsubVideos = subscribeToGalleryVideos(setVideos);
    const unsubContest = subscribeToContestPhotos(setContestPhotos);
    
    getGalleryStats().then(setStats);

    return () => {
      unsubGallery();
      unsubVideos();
      unsubContest();
    };
  }, []);

  const handleDeletePhoto = async (id: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      setIsDeleting(id);
      try {
        await deleteGalleryItem(id);
        toast({
          title: 'Photo deleted',
          description: 'The photo has been removed from the gallery.',
        });
        getGalleryStats().then(setStats);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete photo.',
        });
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      setIsDeleting(id);
      try {
        await deleteGalleryVideo(id);
        toast({
          title: 'Video deleted',
          description: 'The video has been removed.',
        });
        getGalleryStats().then(setStats);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete video.',
        });
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleSetPhotoOfDay = async (id: string) => {
    try {
      await setPhotoOfDay(id);
      toast({
        title: 'Photo of the Day set!',
        description: 'This photo is now featured as the Photo of the Day.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to set Photo of the Day.',
      });
    }
  };

  const regularPhotos = galleryItems.filter(item => !item.isContest);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold font-headline">Gallery Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage photos, videos, and contest submissions
          </p>
        </div>
        <div className="flex gap-2">
          <GalleryFormSheet>
            <Button size="sm" className="gap-1">
              <ImageIcon className="h-4 w-4" />
              Add Photo
            </Button>
          </GalleryFormSheet>
          <VideoFormSheet>
            <Button size="sm" variant="outline" className="gap-1">
              <Video className="h-4 w-4" />
              Add Video
            </Button>
          </VideoFormSheet>
        </div>
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Photos</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPhotos}</div>
              <p className="text-xs text-muted-foreground">
                Across all categories
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVideos}</div>
              <p className="text-xs text-muted-foreground">
                Behind-the-scenes content
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLikes.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Engagement across gallery
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contest Entries</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.contestSubmissions}</div>
              <p className="text-xs text-muted-foreground">
                Customer submissions
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="photos" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Photos ({regularPhotos.length})
          </TabsTrigger>
          <TabsTrigger value="videos" className="gap-2">
            <Video className="h-4 w-4" />
            Videos ({videos.length})
          </TabsTrigger>
          <TabsTrigger value="contest" className="gap-2">
            <Trophy className="h-4 w-4" />
            Contest ({contestPhotos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gallery Photos</CardTitle>
              <CardDescription>
                Manage all gallery photos. Set Photo of the Day to feature on the homepage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regularPhotos.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="w-16 h-12 rounded overflow-hidden bg-muted">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {item.category.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-pink-500" />
                          {item.likes}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-muted-foreground" />
                          {item.views || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {item.isPhotoOfDay && (
                            <Badge className="bg-yellow-500 hover:bg-yellow-600">
                              <Star className="h-3 w-3 mr-1" />
                              POTD
                            </Badge>
                          )}
                          {item.isFeatured && (
                            <Badge variant="outline">Featured</Badge>
                          )}
                          {!item.active && (
                            <Badge variant="destructive">Hidden</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <GalleryFormSheet galleryItem={item}>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            </GalleryFormSheet>
                            <DropdownMenuItem onClick={() => handleSetPhotoOfDay(item.id)}>
                              <Star className="h-4 w-4 mr-2" />
                              Set as Photo of Day
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeletePhoto(item.id)}
                              disabled={isDeleting === item.id}
                            >
                              {isDeleting === item.id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                              )}
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {regularPhotos.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No photos yet. Add your first photo to the gallery.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gallery Videos</CardTitle>
              <CardDescription>
                Manage behind-the-scenes and promotional videos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Thumbnail</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videos.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell>
                        <div className="w-20 h-12 rounded overflow-hidden bg-muted relative">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Video className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{video.title}</TableCell>
                      <TableCell>{video.duration || '--:--'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-muted-foreground" />
                          {video.views || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-pink-500" />
                          {video.likes || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        {video.isFeatured && (
                          <Badge variant="outline">Featured</Badge>
                        )}
                        {!video.active && (
                          <Badge variant="destructive">Hidden</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <VideoFormSheet video={video}>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            </VideoFormSheet>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteVideo(video.id)}
                              disabled={isDeleting === video.id}
                            >
                              {isDeleting === video.id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                              )}
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {videos.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No videos yet. Add your first video.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contest" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Photo Contest Submissions</CardTitle>
              <CardDescription>
                Review and manage customer photo submissions for the contest.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contestPhotos.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="w-16 h-12 rounded overflow-hidden bg-muted">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.submittedBy || 'Anonymous'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-pink-500" />
                          {item.likes}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.createdAt ? format(new Date(item.createdAt), 'MMM d, yyyy') : '-'}
                      </TableCell>
                      <TableCell>
                        {item.active !== false ? (
                          <Badge variant="outline" className="text-green-600">Approved</Badge>
                        ) : (
                          <Badge variant="destructive">Hidden</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <GalleryFormSheet galleryItem={item}>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            </GalleryFormSheet>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeletePhoto(item.id)}
                              disabled={isDeleting === item.id}
                            >
                              {isDeleting === item.id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                              )}
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {contestPhotos.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No contest submissions yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
