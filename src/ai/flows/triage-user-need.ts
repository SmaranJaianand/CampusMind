// triage-user-need.ts
'use server';

/**
 * @fileOverview This file defines the Genkit flow for the AI-guided first-aid chatbot.
 *
 * It includes:
 * - `triageUserNeed`: The main function to triage user needs and suggest resources.
 * - `TriageUserNeedInput`: The input type for the `triageUserNeed` function.
 * - `TriageUserNeedOutput`: The output type for the `triageUserNeed` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TriageUserNeedInputSchema = z.object({
  userInput: z
    .string()
    .describe(
      'The user input describing their current mental or emotional state.'
    ),
});

export type TriageUserNeedInput = z.infer<typeof TriageUserNeedInputSchema>;

const TriageUserNeedOutputSchema = z.object({
  triageResult: z
    .string()
    .describe(
      'A summary of the user needs and recommended resources or actions. If the user expresses thoughts of self-harm, direct them to immediate professional help.'
    ),
  suggestedResources: z
    .array(z.string())
    .describe(
      'A list of suggested resources (e.g., counseling services, hotline numbers) based on the user input.'
    ),
  escalateToProfessional: z
    .boolean()
    .describe(
      'Whether the situation requires immediate escalation to a professional mental health resource.'
    ),
});

export type TriageUserNeedOutput = z.infer<typeof TriageUserNeedOutputSchema>;

export async function triageUserNeed(input: TriageUserNeedInput): Promise<TriageUserNeedOutput> {
  return triageUserNeedFlow(input);
}

const triagePrompt = ai.definePrompt({
  name: 'triagePrompt',
  input: {schema: TriageUserNeedInputSchema},
  output: {schema: TriageUserNeedOutputSchema},
  prompt: `You are an AI-guided first-aid chatbot designed to analyze user responses and triage their mental health needs. Based on the user's input, determine the appropriate level of support and recommend resources.

Consider the following:
- User's emotional state and expressed needs.
- Presence of any thoughts of self-harm or harm to others. If present, immediately escalate to professional resources.
- Availability of on-campus counseling services, mental health helplines, and other support resources.

User Input: {{{userInput}}}

Provide a triageResult summarizing the user needs and recommended resources or actions.  If the user expresses thoughts of self-harm, direct them to immediate professional help and set escalateToProfessional to true.
List any suggestedResources that may be helpful.
Set escalateToProfessional to true if the situation requires immediate escalation to a professional mental health resource, otherwise set it to false.`,
});

const triageUserNeedFlow = ai.defineFlow(
  {
    name: 'triageUserNeedFlow',
    inputSchema: TriageUserNeedInputSchema,
    outputSchema: TriageUserNeedOutputSchema,
  },
  async input => {
    const {output} = await triagePrompt(input);
    return output!;
  }
);
