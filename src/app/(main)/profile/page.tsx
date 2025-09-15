'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/auth-context';
import { logout } from '@/app/auth/actions';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

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
              <AvatarImage src={user?.photoURL || "https://picsum.photos/seed/user-profile/128/128"} data-ai-hint="person portrait" />
              <AvatarFallback>{user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1.5">
              <p className="font-semibold">{user?.displayName || 'Jane Doe'}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
            </div>
          </div>
          <Separator />
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user?.displayName || "Jane Doe"} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email || "jane.doe@university.edu"} />
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
            <Button>Update Profile</Button>
            <Button variant="destructive" onClick={handleLogout}>Logout</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
