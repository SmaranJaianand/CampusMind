
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil } from 'lucide-react';

export default function SchedulingPage() {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl md:text-4xl">Scheduling AI</h1>
        <p className="text-muted-foreground mt-2">
          A soft task scheduler to help you organize your day without feeling overwhelmed.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>Your Tasks</CardTitle>
                <CardDescription>
                    List the tasks you need to get done, one per line. The AI will break them down for you.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Textarea placeholder="- Finish math assignment&#x0a;- Do laundry&#x0a;- Read one chapter" rows={5} />
                </CardContent>
                <CardFooter>
                <Button>Generate Schedule</Button>
                </CardFooter>
            </Card>
             <p className="text-sm text-center text-muted-foreground px-4">
                You can import a consultation summary from the 'Consultations' tab to give the AI more context about your current needs.
            </p>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Your Gentle Schedule</CardTitle>
              <CardDescription>
                Here is a suggested schedule based on your tasks and consultation notes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-headline text-lg text-primary mb-2">Morning</h3>
                <div className="space-y-4 border-l-2 border-primary/20 pl-4 ml-2">
                  <div className="relative">
                    <div className="absolute -left-[27px] top-1 h-4 w-4 rounded-full bg-primary" />
                    <div className="flex items-start gap-4">
                      <Checkbox id="task-1" className="mt-1" />
                      <div className="grid gap-1.5">
                         <div className="flex items-center gap-2">
                           <p className="font-semibold">9:30 AM - 10:15 AM: Work on Math Assignment (Part 1)</p>
                           <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Pencil className="h-3 w-3" />
                           </Button>
                         </div>
                        <p className="text-sm text-muted-foreground">Focus on the first two problems. It's okay if it's not perfect.</p>
                      </div>
                    </div>
                  </div>
                   <div className="relative">
                     <div className="absolute -left-[27px] top-1 h-4 w-4 rounded-full bg-secondary-foreground/50" />
                     <div className="flex items-start gap-4">
                       <Checkbox id="break-1" className="mt-1" />
                        <div className="grid gap-1.5">
                           <div className="flex items-center gap-2">
                            <p className="font-semibold">10:15 AM - 10:45 AM: Mindful Break</p>
                             <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Pencil className="h-3 w-3" />
                             </Button>
                           </div>
                          <p className="text-sm text-muted-foreground">Listen to some music or go for a short walk.</p>
                        </div>
                     </div>
                  </div>
                   <div className="relative">
                     <div className="absolute -left-[27px] top-1 h-4 w-4 rounded-full bg-primary" />
                     <div className="flex items-start gap-4">
                        <Checkbox id="task-2" className="mt-1" />
                        <div className="grid gap-1.5">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">10:45 AM - 11:30 AM: Read Chapter (First Half)</p>
                               <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Pencil className="h-3 w-3" />
                               </Button>
                            </div>
                          <p className="text-sm text-muted-foreground">Just get through the first few pages to build momentum.</p>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
              <Separator />
               <div>
                <h3 className="font-headline text-lg text-primary mb-2">Afternoon</h3>
                <div className="space-y-4 border-l-2 border-primary/20 pl-4 ml-2">
                  <div className="relative">
                     <div className="absolute -left-[27px] top-1 h-4 w-4 rounded-full bg-secondary-foreground/50" />
                     <div className="flex items-start gap-4">
                      <Checkbox id="task-3" className="mt-1" />
                      <div className="grid gap-1.5">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">1:30 PM - 2:00 PM: Start Laundry</p>
                           <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Pencil className="h-3 w-3" />
                           </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">A small, easy win to get you going.</p>
                      </div>
                     </div>
                  </div>
                   <div className="relative">
                     <div className="absolute -left-[27px] top-1 h-4 w-4 rounded-full bg-primary" />
                      <div className="flex items-start gap-4">
                        <Checkbox id="task-4" className="mt-1" />
                        <div className="grid gap-1.5">
                           <div className="flex items-center gap-2">
                            <p className="font-semibold">2:00 PM - 2:45 PM: Work on Math Assignment (Part 2)</p>
                             <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Pencil className="h-3 w-3" />
                             </Button>
                           </div>
                          <p className="text-sm text-muted-foreground">Try the next problem. Remember what Dr. Carter said about small steps.</p>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
