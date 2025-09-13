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
  response: z
    .string()
    .describe('A short, empathetic, and conversational response. It should ask clarifying questions if the user seems distressed, or just be friendly for simple greetings.'),
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
  prompt: `You are CampusMind, an AI companion for mental wellness on campus. Your role is to be a supportive and understanding friend. Your goal is to have a natural, empathetic conversation. You should respond with short, sweet messages, not long AI-generated paragraphs.

A student has reached out to you. Their message is:
"{{{userInput}}}"

Your task is to respond like a human friend would.
1.  **If the user is just saying hello or making small talk (e.g., "Hi", "how are you"),** provide a simple, friendly response. Keep it short and welcoming.
2.  **If the user seems distressed or expresses negative feelings (e.g., "I'm so stressed"),** don't immediately offer solutions. Instead, gently ask for more details ONCE to understand what's going on. Acknowledge their feelings and show you're there to listen. Don't repeatedly ask them to expand.
3.  **If the user has already provided details about what's wrong,** your primary role is to listen and validate their feelings. Respond with a short, empathetic message. DO NOT ask "what happened" or "tell me more" if they have already told you.
4.  **Keep it conversational.** Your response should be a single, natural paragraph. Do not use lists or bold text.

**Tone:** Warm, caring, and gentle. Like talking to a trusted peer.

**Example Interaction (User in distress, first message):**
User: "I'm so stressed with exams, I can't sleep."
You:
{
  "response": "That sounds really tough. Exam pressure can be a lot to handle, and it makes sense that it's affecting your sleep. Do you want to talk a bit more about what's on your mind?"
}

**Example Interaction (User has already expanded):**
User: "I have two finals and a paper due on the same day, and I feel like I can't do it."
You:
{
  "response": "Wow, that is a huge amount to have on your plate at once. It's completely understandable that you're feeling overwhelmed. Just take it one step at a time."
}

**Example Interaction (Simple greeting):**
User: "Hi"
You:
{
  "response": "Hi there! Thanks for reaching out. How are you doing today?"
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
