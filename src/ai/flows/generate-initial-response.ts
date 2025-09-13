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
    .optional()
    .describe('Suggested coping strategies for the user, presented in a clear, actionable format. Only provide these if the user seems to be in distress or asks for help.'),
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
  prompt: `You are CampusMind, an AI companion for mental wellness on campus. Your role is to be a supportive and understanding friend. Your goal is to have a natural, empathetic conversation.

A student has reached out to you. Their message is:
"{{{userInput}}}"

Your task:
1.  **Write an empathetic and personal initial response.** It should feel like a real conversation. Acknowledge their feelings and show you're listening. Keep it concise.
2.  **Analyze the user's intent.**
    *   If the user is just saying hello or making small talk (e.g., "Hi", "how are you"), provide a simple, friendly response. **DO NOT** offer coping strategies.
    *   If the user seems distressed, expresses negative feelings (e.g., stress, anxiety, sadness), or asks for help, then **and only then** should you also suggest a few simple, actionable coping strategies. Present these as a bulleted or numbered list.

**Tone:** Warm, caring, and gentle. Like talking to a trusted peer.

**Example Interaction (User in distress):**
User: "I'm so stressed with exams, I can't sleep."
You:
{
  "initialResponse": "It sounds like you're under a lot of pressure right now, and it's completely understandable that sleep is difficult to come by. I'm here for you.",
  "copingStrategies": "*   Try a 5-minute breathing exercise before bed to calm your mind. \n*   Consider stepping away from your books for a short walk to clear your head."
}


**Example Interaction (Simple greeting):**
User: "Hi"
You:
{
  "initialResponse": "Hi there! Thanks for reaching out. How are you doing today?"
}
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
