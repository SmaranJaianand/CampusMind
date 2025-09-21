
'use server';

import {
  generateInitialResponse,
  type GenerateInitialResponseOutput,
} from '@/ai/flows/generate-initial-response';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, getDocs, Timestamp, orderBy } from 'firebase/firestore/lite';
import { auth } from '@/lib/firebase';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Timestamp;
}

export async function getAiResponse(
  userInput: string,
  userId: string
): Promise<GenerateInitialResponseOutput> {
  try {
    // First, save the user's message
    await saveMessage(userId, { sender: 'user', text: userInput });

    // Then, get the AI's response
    const response = await generateInitialResponse({ userInput });

    // Finally, save the AI's response
    await saveMessage(userId, { sender: 'ai', text: response.response });

    return response;
  } catch (error) {
    console.error('Error getting AI response:', error);
    return {
      response: "I'm sorry, but I'm having trouble connecting right now. Please try again in a moment.",
    };
  }
}

export async function saveMessage(userId: string, message: { sender: 'user' | 'ai'; text: string }): Promise<void> {
    if (!db) {
        console.error("Firestore is not initialized.");
        return;
    }
    try {
        await addDoc(collection(db, `users/${userId}/messages`), {
            ...message,
            timestamp: Timestamp.now(),
        });
    } catch (error) {
        console.error("Error saving message to Firestore:", error);
    }
}

export async function getMessages(userId: string): Promise<ChatMessage[]> {
    if (!db) {
        console.error("Firestore is not initialized.");
        return [];
    }
    try {
        const messagesRef = collection(db, `users/${userId}/messages`);
        const q = query(messagesRef, orderBy('timestamp', 'asc'));
        const querySnapshot = await getDocs(q);
        const messages: ChatMessage[] = [];
        querySnapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() } as ChatMessage);
        });
        return messages;
    } catch (error) {
        console.error("Error fetching messages from Firestore:", error);
        return [];
    }
}


const sendSupportEmailSchema = z.object({
  toEmail: z.string().email(),
  fromEmail: z.string().email().optional(),
  subject: z.string(),
  body: z.string(),
});

export async function sendSupportEmail(formData: FormData): Promise<{success: boolean; message: string}> {
  const result = sendSupportEmailSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { success: false, message: 'Invalid form data.' };
  }
  
  const { toEmail, fromEmail, subject, body } = result.data;
  
  // IMPORTANT: You must configure these environment variables with your email provider's details.
  // For example, using Gmail, you would need to set up an "App Password".
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: (process.env.SMTP_PORT === '465'), // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify(); // Verify connection configuration
  } catch (error) {
    console.error("Email transporter configuration error:", error);
    return { success: false, message: 'Could not connect to email server. Please check server configuration.' };
  }

  const finalBody = fromEmail 
    ? `${body}\n\n--- \nThis message was sent from ${fromEmail}`
    : body;

  try {
    await transporter.sendMail({
      from: `"CampusMind Support" <${process.env.SMTP_USER}>`, // sender address
      to: toEmail, // list of receivers
      subject: subject, // Subject line
      text: finalBody, // plain text body
      html: `<p>${finalBody.replace(/\n/g, '<br>')}</p>`, // html body
    });

    return { success: true, message: 'Support email sent successfully.' };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, message: 'An error occurred while trying to send the email.' };
  }
}
