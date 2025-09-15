'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signup, type SignupState } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const initialState: SignupState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Creating Account...' : 'Create an account'}
    </Button>
  );
}

export default function SignupPage() {
  const [state, formAction] = useFormState(signup, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      // Don't redirect immediately, let the user see the success message.
      const timer = setTimeout(() => {
        router.replace('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

  return (
    <Card className="w-full max-w-sm">
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
           {state.message && (
             <Alert variant={state.success ? 'default' : 'destructive'}>
                {state.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{state.success ? 'Success!' : 'Signup Failed'}</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
             </Alert>
           )}

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton />
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
