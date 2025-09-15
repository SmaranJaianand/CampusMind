
'use server';

import { auth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { z } from 'zod';

const emailSchema = z.string().email({ message: 'Please enter a valid email address.' });
const passwordSchema = z.string().min(6, { message: 'Password must be at least 6 characters long.' });

const signupSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, { message: 'Password is required.' }),
});

export type SignupState = {
  success: boolean;
  message: string;
};

export async function signup(prevState: SignupState, formData: FormData): Promise<SignupState> {
  const result = signupSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    return {
      success: false,
      message: result.error.errors.map((e) => e.message).join(' '),
    };
  }

  const { email, password } = result.data;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, message: 'Signup successful! Redirecting...' };
  } catch (error: any) {
    let message = 'An unknown error occurred.';
    if (error.code === 'auth/email-already-in-use') {
      message = 'This email is already in use. Please try logging in.';
    }
    return { success: false, message };
  }
}


export type LoginState = {
  success: boolean;
  message: string;
};

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const result = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    return {
      success: false,
      message: result.error.errors.map((e) => e.message).join(' '),
    };
  }

  const { email, password } = result.data;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true, message: 'Login successful!' };
  } catch (error: any) {
    return { success: false, message: 'Invalid email or password. Please try again.' };
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

    