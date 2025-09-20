
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
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  useEffect(() => {
    if (state.success) {
      toast({
          title: "Account Created!",
          description: state.message,
      });
      const timer = setTimeout(() => {
        router.replace('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.success, state.message, router, toast]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
        <CardDescription className="text-center">
            Create your account using your email and password.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {state.message && !state.success && (
          <Alert variant={'destructive'}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{'Signup Failed'}</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

         <form action={formAction} className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
            </div>
            <SubmitButton />
        </form>

      </CardContent>
      <CardFooter className="flex flex-col gap-4">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="underline">
              Login
            </Link>
          </p>
      </CardFooter>
    </Card>
  );
}
