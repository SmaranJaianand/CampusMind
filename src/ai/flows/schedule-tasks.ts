
'use server';

/**
 * @fileOverview A Genkit flow for generating a gentle, non-exhausting task schedule for a student.
 *
 * - scheduleTasks - A function that creates a schedule based on user's tasks and consultation notes.
 * - ScheduleTasksInput - The input type for the scheduleTasks function.
 * - ScheduleTasksOutput - The return type for the scheduleTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScheduleTasksInputSchema = z.object({
  tasks: z.array(z.string()).describe('A list of tasks the user wants to schedule.'),
  consultationSummary: z.string().describe("A summary from a counselor about the user's current state and recommendations."),
});
export type ScheduleTasksInput = z.infer<typeof ScheduleTasksInputSchema>;

const TaskSchema = z.object({
  time: z.string().describe("The suggested time for the task (e.g., '9:30 AM - 10:15 AM')."),
  title: z.string().describe('The title of the task or break.'),
  description: z.string().describe('A brief, encouraging description of the task.'),
  type: z.enum(['task', 'break']).describe("Whether this is a task or a break."),
});

const ScheduleBlockSchema = z.object({
  title: z.string().describe("The time of day for this block (e.g., 'Morning', 'Afternoon')."),
  tasks: z.array(TaskSchema),
});

const ScheduleTasksOutputSchema = z.object({
  schedule: z.array(ScheduleBlockSchema).describe('The generated schedule, broken into blocks.'),
});
export type ScheduleTasksOutput = z.infer<typeof ScheduleTasksOutputSchema>;

export async function scheduleTasks(
  input: ScheduleTasksInput
): Promise<ScheduleTasksOutput> {
  return scheduleTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scheduleTasksPrompt',
  input: { schema: ScheduleTasksInputSchema },
  output: { schema: ScheduleTasksOutputSchema },
  prompt: `You are a supportive AI assistant that helps students create gentle, effective schedules. Your goal is to break down tasks into manageable parts and interleave them with breaks, based on their consultation notes.

### Instructions:
1.  **Analyze the Consultation Summary:** Pay close attention to the recommendations. If it mentions anxiety, stress, or feeling overwhelmed, prioritize shorter work periods and more frequent breaks.
2.  **Break Down Tasks:** Do not schedule large, monolithic tasks. Break them into smaller parts (e.g., "Finish math assignment" becomes "Work on Math Assignment (Part 1)").
3.  **Schedule Generously:** Leave buffer time. Schedule breaks between tasks. The goal is momentum, not exhaustion.
4.  **Be Encouraging:** The descriptions for each task should be gentle and motivating. Frame them as small, achievable steps.
5.  **Output Format:** Structure the entire day's schedule into blocks like "Morning", "Afternoon", and "Evening".

---
### Consultation Summary:
{{{consultationSummary}}}

### User's Tasks:
{{#each tasks}}
- {{{this}}}
{{/each}}
---

Generate a schedule in the specified JSON format.
`,
});


const scheduleTasksFlow = ai.defineFlow(
  {
    name: 'scheduleTasksFlow',
    inputSchema: ScheduleTasksInputSchema,
    outputSchema: ScheduleTasksOutputSchema,
  },
  async input => {
    // In a real app, you might fetch the consultation summary from a database here.
    const {output} = await prompt(input);
    return output!;
  }
);
