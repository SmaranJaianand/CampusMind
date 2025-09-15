
'use server';

import { auth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
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
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Set admin display name if it's the admin email
    if (email === 'admin@campusmind.app') {
      await updateProfile(userCredential.user, { displayName: 'Admin' });
    }

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

   if (email === 'admin@campusmind.app' && password === 'adminpwd') {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true, message: 'Admin login successful!' };
      } catch (error: any) {
         // If admin user does not exist, create it
        if (error.code === 'auth/user-not-found') {
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: 'Admin' });
            return { success: true, message: 'Admin account created and logged in!' };
          } catch (createError: any) {
            return { success: false, message: 'Failed to create admin account.' };
          }
        }
        return { success: false, message: 'Admin login failed.' };
      }
  }

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

const profileUpdateSchema = z.object({
  displayName: z.string().optional(),
  photoURL: z.string().url().optional(),
});

export type ProfileUpdateState = {
  success: boolean;
  message: string;
};

export async function updateUserProfile(data: { displayName?: string, photoURL?: string }): Promise<ProfileUpdateState> {
    const user = auth.currentUser;
    if (!user) {
        return { success: false, message: "You must be logged in to update your profile." };
    }

    const result = profileUpdateSchema.safeParse(data);
    if (!result.success) {
        return { success: false, message: result.error.errors.map((e) => e.message).join(' ') };
    }

    try {
        const updateData: { displayName?: string, photoURL?: string } = {};
        if (result.data.displayName) {
            updateData.displayName = result.data.displayName;
        }
        if (result.data.photoURL) {
            updateData.photoURL = result.data.photoURL;
        }

        await updateProfile(user, updateData);
        return { success: true, message: 'Profile updated successfully.' };
    } catch (error: any) {
        return { success: false, message: 'Failed to update profile.' };
    }
}
    
