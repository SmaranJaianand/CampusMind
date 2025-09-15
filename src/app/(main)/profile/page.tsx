'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/auth-context';
import { logout, updateUserProfile } from '@/app/auth/actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const handleUpdateProfile = () => {
    startTransition(async () => {
      const result = await updateUserProfile({ displayName, photoURL });
      if (result.success) {
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been successfully updated.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: result.message,
        });
      }
    });
  };

  const handlePhotoChange = () => {
      const newPhotoURL = prompt("Enter the URL of your new profile picture:");
      if (newPhotoURL) {
          setPhotoURL(newPhotoURL);
          startTransition(async () => {
            const result = await updateUserProfile({ displayName, photoURL: newPhotoURL });
             if (result.success) {
                toast({
                    title: 'Profile Photo Updated',
                    description: 'Your photo has been successfully updated.',
                });
                // Optimistically update UI, or wait for user object to refresh
                if(user) {
                    user.reload();
                }
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Update Failed',
                    description: result.message,
                });
            }
          });
      }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl md:text-4xl">Your Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and settings.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your photo and personal details here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={photoURL || "https://picsum.photos/seed/user-profile/128/128"} data-ai-hint="person portrait" />
              <AvatarFallback>{displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1.5">
              <p className="font-semibold">{displayName || 'Jane Doe'}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Button variant="outline" size="sm" onClick={handlePhotoChange}>
                Change Photo
              </Button>
            </div>
          </div>
          <Separator />
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email || "jane.doe@university.edu"} disabled />
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="major">Major</Label>
                <Input id="major" defaultValue="Psychology" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" defaultValue="Sophomore" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleUpdateProfile} disabled={isPending}>{isPending ? 'Updating...' : 'Update Profile'}</Button>
            <Button variant="destructive" onClick={handleLogout}>Logout</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
