
'use server';

import { auth as serverAuth } from '@/lib/firebase-admin';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { z } from 'zod';

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
  const auth = getAuth(app);

  if (!result.success) {
    return {
      success: false,
      message: result.error.errors.map((e) => e.message).join(' '),
    };
  }

  const { email, password } = result.data;

   // Special case to create the admin user if they don't exist and are trying to log in.
   if (email === 'admin@campusmind.app' && password === 'adminpwd') {
      try {
        // Attempt to sign in first.
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true, message: 'Admin login successful!' };
      } catch (error: any) {
         // If the admin user does not exist, create it.
        if (error.code === 'auth/user-not-found') {
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Set the display name for the newly created admin user.
            await updateProfile(userCredential.user, { displayName: 'Admin' });
            // Now that the user is created, signInWithEmailAndPassword will work on subsequent logins.
            return { success: true, message: 'Admin account created and logged in!' };
          } catch (createError: any) {
            return { success: false, message: 'Failed to create admin account. It may already exist with a different password.' };
          }
        }
        // If another error occurred (like wrong password), fall through to the generic error handling.
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
    const auth = getAuth(app);
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
    
