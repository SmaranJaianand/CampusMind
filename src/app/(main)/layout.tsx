'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
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

function EmergencyDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <Siren className="mr-2 h-4 w-4" />
          SOS - Immediate Help
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you in immediate distress?</AlertDialogTitle>
          <AlertDialogDescription>
            If this is an emergency, please use this feature to connect with a crisis counselor immediately. This service is anonymous and available 24/7.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Link href="#">Connect to Crisis Line</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Siren className="h-5 w-5" />
                       <span className="sr-only">SOS</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you in immediate distress?</AlertDialogTitle>
                      <AlertDialogDescription>
                        If this is an emergency, please use this feature to connect with a crisis counselor immediately. This service is anonymous and available 24/7.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                       <AlertDialogAction asChild>
                        <Link href="#">Connect to Crisis Line</Link>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
