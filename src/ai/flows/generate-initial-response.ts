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
  copingStrategies:
    z.string().describe('Suggested coping strategies for the user.'),
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
  prompt: `You are an AI-guided first-aid chatbot designed to provide initial mental health support and coping strategies.

  Based on the user's input, generate an empathetic initial response and suggest relevant coping strategies.

  User Input: {{{userInput}}}

  Respond in a way that is supportive, understanding, and helpful.`,
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
