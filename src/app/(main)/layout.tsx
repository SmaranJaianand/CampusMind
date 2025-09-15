

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Bot,
  CalendarDays,
  Library,
  MessagesSquare,
  PanelLeft,
  User,
  Shield,
  Siren,
  CalendarCheck,
  FileText,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const navItems = [
  { href: '/', label: 'AI First-Aid', icon: Bot },
  { href: '/scheduling', label: 'Scheduling AI', icon: CalendarCheck },
  { href: '/consultations', label: 'Consultations', icon: FileText },
  { href: '/booking', label: 'Booking', icon: CalendarDays },
  { href: '/resources', label: 'Resource Hub', icon: Library },
  { href: '/forum', label: 'Forum', icon: MessagesSquare },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/admin', label: 'Admin', icon: Shield },
];

function EmergencyDialog({ isMobile = false }: { isMobile?: boolean }) {
  const [customNumber, setCustomNumber] = React.useState('1-800-273-8255');
  const [customEmail, setCustomEmail] = React.useState('support@campus.test');
  const dialogId = isMobile ? 'mobile' : 'desktop';

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {isMobile ? (
          <Button variant="destructive" size="icon">
            <Siren className="h-5 w-5" />
            <span className="sr-only">SOS</span>
          </Button>
        ) : (
          <Button variant="destructive" className="w-full">
            <Siren className="mr-2 h-4 w-4" />
            SOS - Immediate Help
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you in immediate distress?</AlertDialogTitle>
          <AlertDialogDescription>
            This service will open your default email client to connect you with support. Enter the email address you want to contact below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
           <div className="grid gap-2">
            <Label htmlFor={`custom-email-${dialogId}`}>Support Email</Label>
            <Input 
              id={`custom-email-${dialogId}`}
              type="email"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              placeholder="Enter support email"
            />
           </div>
          <div className="grid gap-2">
            <Label htmlFor={`custom-number-${dialogId}`}>Emergency Phone Number (For Reference)</Label>
            <Input 
              id={`custom-number-${dialogId}`}
              value={customNumber}
              onChange={(e) => setCustomNumber(e.target.value)}
              placeholder="Enter phone number"
              disabled
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Link href={`mailto:${customEmail}?subject=Urgent%20Support%20Needed&body=I%20am%20reaching%20out%20for%20immediate%20support.`}>Connect to Support</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Logo className="h-12 w-12 text-primary animate-pulse" />
                <p className="text-muted-foreground">Loading your experience...</p>
            </div>
      </div>
    );
  }


  const NavLinks = () => (
    <nav className="grid items-start gap-2 text-sm font-medium">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            { 'bg-accent text-primary': pathname === href }
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo className="h-8 w-8 text-primary" />
              <span className="font-headline text-lg">CampusMind</span>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="grid items-start p-2 text-sm font-medium lg:p-4">
              <NavLinks />
            </div>
          </div>
           <div className="mt-auto p-4">
            <EmergencyDialog />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold"
                >
                  <Logo className="h-8 w-8 text-primary" />
                  <span className="font-headline text-lg">CampusMind</span>
                </Link>
              </div>
              <div className="mt-4 flex-1 overflow-y-auto">
                <NavLinks />
              </div>
              <div className="mt-auto p-4">
                <EmergencyDialog />
              </div>
            </SheetContent>
          </Sheet>
           <div className="flex items-center gap-2 font-semibold">
              <Logo className="h-8 w-8 text-primary md:hidden" />
              <span className="font-headline text-lg md:hidden">CampusMind</span>
            </div>
             <div className="ml-auto">
                <EmergencyDialog isMobile={true} />
            </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
