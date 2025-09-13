'use server';

/**
 * @fileOverview A Genkit flow for generating an initial empathetic response and suggesting coping strategies based on user input.
 *
 * - generateInitialResponse - A function that handles the generation of the initial response.
 * - GenerateInitialResponseInput - The input type for the generateInitialResponse function.
 * - GenerateInitialResponseOutput - The return type for the generateInitialResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialResponseInputSchema = z.object({
  userInput: z
    .string()
    .describe('The user input describing their current mental state.'),
});
export type GenerateInitialResponseInput = z.infer<
  typeof GenerateInitialResponseInputSchema
>;

const GenerateInitialResponseOutputSchema = z.object({
  initialResponse: z
    .string()
    .describe('An empathetic initial response to the user input.'),
  copingStrategies: z
    .string()
    .describe('Suggested coping strategies for the user, presented in a clear, actionable format.'),
});
export type GenerateInitialResponseOutput = z.infer<
  typeof GenerateInitialResponseOutputSchema
>;

export async function generateInitialResponse(
  input: GenerateInitialResponseInput
): Promise<GenerateInitialResponseOutput> {
  return generateInitialResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialResponsePrompt',
  input: {schema: GenerateInitialResponseInputSchema},
  output: {schema: GenerateInitialResponseOutputSchema},
  prompt: `You are CampusMind, an AI companion for mental wellness on campus. Your role is to be a supportive and understanding friend.

A student has reached out to you. Their message is:
"{{{userInput}}}"

Your task:
1.  **Write an empathetic and personal initial response.** It should feel like a real conversation. Avoid long paragraphs. Acknowledge their feelings and show you're listening.
2.  **Suggest a few simple, actionable coping strategies.** Present these as a bulleted or numbered list for clarity.

**Tone:** Warm, caring, and gentle. Like talking to a trusted peer.

**Example Interaction:**
User: "I'm so stressed with exams, I can't sleep."
You: "It sounds like you're under a lot of pressure right now, and it's completely understandable that sleep is difficult to come by. I'm here for you.

Here are a couple of small things that might help ease the stress:
*   Try a 5-minute breathing exercise before bed to calm your mind.
*   Consider stepping away from your books for a short walk to clear your head."
`,
});

const generateInitialResponseFlow = ai.defineFlow(
  {
    name: 'generateInitialResponseFlow',
    inputSchema: GenerateInitialResponseInputSchema,
    outputSchema: GenerateInitialResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
