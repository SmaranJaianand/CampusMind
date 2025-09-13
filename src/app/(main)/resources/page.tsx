import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages, ImagePlaceholder } from '@/lib/placeholder-images';
import { Video, Music, BookOpen } from 'lucide-react';
import Link from 'next/link';

const videos = PlaceHolderImages.filter(img => img.id.startsWith('video'));
const audios = PlaceHolderImages.filter(img => img.id.startsWith('audio'));
const guides = PlaceHolderImages.filter(img => img.id.startsWith('guide'));

const ResourceCard = ({ resource }: { resource: ImagePlaceholder }) => (
  <Link href="#" className="group block">
    <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="aspect-video overflow-hidden">
          <Image
            src={resource.imageUrl}
            alt={resource.description}
            width={600}
            height={400}
            data-ai-hint={resource.imageHint}
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="font-headline text-lg mb-1">{resource.description}</CardTitle>
        <CardDescription>A helpful resource to support your wellness journey.</CardDescription>
      </CardContent>
    </Card>
  </Link>
);

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl md:text-4xl">Resource Hub</h1>
        <p className="text-muted-foreground mt-2">A collection of videos, audio, and guides for your mental wellness.</p>
      </div>

      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="videos"><Video className="mr-2 h-4 w-4"/>Videos</TabsTrigger>
          <TabsTrigger value="audio"><Music className="mr-2 h-4 w-4"/>Audio</TabsTrigger>
          <TabsTrigger value="guides"><BookOpen className="mr-2 h-4 w-4"/>Guides</TabsTrigger>
        </TabsList>
        <TabsContent value="videos" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map(resource => <ResourceCard key={resource.id} resource={resource} />)}
          </div>
        </TabsContent>
        <TabsContent value="audio" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {audios.map(resource => <ResourceCard key={resource.id} resource={resource} />)}
          </div>
        </TabsContent>
        <TabsContent value="guides" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map(resource => <ResourceCard key={resource.id} resource={resource} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
