import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Heart, MessageCircle, PlusCircle } from 'lucide-react';

const forumPosts = [
  {
    id: 1,
    author: 'Alex S.',
    avatar: 'https://picsum.photos/seed/alex/40/40',
    avatarHint: 'person portrait',
    title: "Feeling overwhelmed with midterms, any advice?",
    content: "I'm in my second year and the pressure is really getting to me. I feel like I'm falling behind in all my classes and don't know how to catch up. Has anyone else felt this way?",
    likes: 28,
    comments: 12,
  },
  {
    id: 2,
    author: 'Jessica B.',
    avatar: 'https://picsum.photos/seed/jess/40/40',
    avatarHint: 'person smiling',
    title: "Tips for making friends in a new city?",
    content: "I just moved to campus and don't know many people. It's been a bit lonely. What are some good ways to meet new people and make friends here?",
    likes: 45,
    comments: 23,
  },
  {
    id: 3,
    author: 'Mike R.',
    avatar: 'https://picsum.photos/seed/mike/40/40',
    avatarHint: 'person glasses',
    title: "How do you balance studies and a part-time job?",
    content: "Working 15 hours a week and trying to keep my grades up is tough. Looking for some time management hacks or just to hear from others in the same boat.",
    likes: 19,
    comments: 7,
  },
    {
    id: 4,
    author: 'Sarah L.',
    avatar: 'https://picsum.photos/seed/sarah/40/40',
    avatarHint: 'woman portrait',
    title: "Positive affirmations that have helped you",
    content: "Let's share some positivity! What are some affirmations or positive thoughts that help you get through a tough day? Mine is 'This is a challenge, not a threat.'",
    likes: 62,
    comments: 31,
  },
];


export default function ForumPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl">Peer Support Forum</h1>
          <p className="text-muted-foreground mt-2">A moderated space to connect with and support fellow students.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Post
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {forumPosts.map(post => (
          <Card key={post.id} className="flex flex-col justify-between transition-all duration-300 ease-in-out hover:shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={post.avatar} alt={post.author} data-ai-hint={post.avatarHint} />
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-semibold">{post.author}</span>
              </div>
              <CardTitle className="font-headline text-xl pt-4">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-3">{post.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4" /> {post.likes}
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="h-4 w-4" /> {post.comments}
                </span>
              </div>
              <Link href="#" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                Read More <ArrowRight className="h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
