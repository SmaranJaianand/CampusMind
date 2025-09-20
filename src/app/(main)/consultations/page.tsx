'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const consultationNotes = [
  {
    id: 1,
    counselor: "Dr. Ben Carter",
    date: "2024-05-10",
    summary: "Patient has been feeling increased anxiety around academic deadlines. Recommended breaking tasks into smaller, more manageable steps and incorporating short, frequent breaks to prevent feeling overwhelmed. Suggested mindfulness exercises before starting study sessions.",
  },
  {
    id: 2,
    counselor: "Dr. Anya Sharma",
    date: "2024-04-28",
    summary: "Patient reported feelings of social isolation and loneliness. We discussed strategies for meeting new people through campus clubs and events. Role-played conversation starters. Patient seems motivated to try joining a study group for their history class.",
  },
   {
    id: 3,
    counselor: "Dr. Chloe Davis",
    date: "2024-05-15",
    summary: "Patient is struggling to balance a part-time job with a heavy course load, leading to poor sleep and high stress. We worked on a time management plan and identified non-essential commitments that could be temporarily paused. Recommended prioritizing sleep and scheduling dedicated downtime.",
  },
];


export default function ConsultationsPage() {
    const { toast } = useToast();

    const handleCopy = (summary: string) => {
        navigator.clipboard.writeText(summary);
        toast({
            title: "Copied to Clipboard!",
            description: "The consultation summary has been copied. You can now paste it into the AI Scheduler.",
        });
    }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl md:text-4xl">Consultation Summaries</h1>
        <p className="text-muted-foreground mt-2">
          Review summaries from your past sessions. This information is confidential.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {consultationNotes.map((note) => (
          <Card key={note.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>Summary from {note.counselor}</CardTitle>
              <CardDescription>Date: {note.date}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{note.summary}</p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" onClick={() => handleCopy(note.summary)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy to AI Scheduler chat
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
