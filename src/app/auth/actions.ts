
'use server';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, type UserCredential } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { z } from 'zod';
import { cookies } from 'next/headers';


const emailSchema = z.string().email({ message: 'Please enter a valid email address.' });
const passwordSchema = z.string().min(6, { message: 'Password must be at least 6 characters long.' });

const signupSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
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
    const auth = getAuth(app);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Set admin display name if it's the admin email
    if (email === 'admin@campusmind.app') {
      await updateProfile(userCredential.user, { displayName: 'Admin' });
    }
     const idToken = await userCredential.user.getIdToken();
    cookies().set('firebase-session', idToken, { httpOnly: true, secure: true, path: '/' });


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

const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const result = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    return {
      success: false,
      message: result.error.errors.map((e) => e.message).join(' '),
    };
  }

  const { email, password } = result.data;
  const auth = getAuth(app);
  let userCredential: UserCredential | null = null;
  
  try {
    if (email === 'admin@campusmind.app') {
      try {
        // Try to sign in the admin first.
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (signInError: any) {
        // If the admin user doesn't exist, create them.
        if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
          try {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: 'Admin' });
          } catch (createError: any) {
             // This might happen if the account exists but the password was wrong on the initial try.
             return { success: false, message: 'Failed to create admin account. It may already exist with a different password.' };
          }
        } else {
          // Another sign-in error occurred (e.g., wrong password for an existing admin).
          throw signInError;
        }
      }
    } else {
      // For regular users, just sign them in.
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    }

    if (!userCredential) {
        return { success: false, message: 'Could not authenticate user. Please try again.' };
    }
    
    // Set the session cookie. This will now run for the admin on their first login too.
    const idToken = await userCredential.user.getIdToken();
    cookies().set('firebase-session', idToken, { httpOnly: true, secure: true, path: '/' });

    return { success: true, message: 'Login successful! Redirecting...' };

  } catch (error: any) {
    return { success: false, message: 'Invalid email or password. Please try again.' };
  }
}

export async function logout() {
  try {
    cookies().delete('firebase-session');
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
    const auth = getAuth(app);
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
