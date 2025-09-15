'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login, type LoginState } from '@/app/auth/actions';
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
import { useEffect, useState, useRef } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { auth, googleProvider } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup } from 'firebase/auth';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const initialLoginState: LoginState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Logging In...' : 'Login with Email'}
    </Button>
  );
}

function GoogleSignInButton() {
  const { pending } = useFormStatus();
    const { toast } = useToast();
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        setError(null);
        try {
            await signInWithPopup(auth, googleProvider);
            // The useEffect will handle the redirect on auth state change.
             toast({
                title: "Login Successful!",
                description: "You've successfully signed in with Google.",
                variant: 'default',
            });
        } catch (error: any) {
            setError('Failed to sign in with Google. Please try again.');
            console.error(error);
        }
    };

  return (
    <>
      {error && (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Google Sign-In Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button variant="outline" type="button" className="w-full" disabled={pending} onClick={handleGoogleSignIn}>
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.7 0 265.2 0 128.5 110.3 18.2 244 18.2c71.2 0 130.3 27.8 174.2 68.9l-65.7 64.3C308.1 120.9 278.4 104 244 104c-63.9 0-116.3 52.4-116.3 116.3s52.4 116.3 116.3 116.3c70.4 0 98.8-52.8 102.7-77.9H244V261.8h244z"></path></svg>
        Sign in with Google
      </Button>
    </>
  );
}


export default function LoginPage() {
  const [state, formAction] = useFormState(login, initialLoginState);
  const router = useRouter();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [phoneAuthError, setPhoneAuthError] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (state.success) {
      toast({
        title: "Login Successful!",
        description: "You've successfully signed in.",
      });
      const timer = setTimeout(() => {
        router.replace('/');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.success, router, toast]);

  const setupRecaptcha = () => {
    if (!recaptchaContainerRef.current) return;
    // Clear previous verifier if it exists
    if ((window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier.clear();
    }
    const verifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        'size': 'invisible',
        'callback': (response: any) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
    });
    (window as any).recaptchaVerifier = verifier;
    return verifier;
  }

  const handleSendOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      setPhoneAuthError(null);
      setIsSendingOtp(true);
      try {
        const appVerifier = setupRecaptcha();
        if (!appVerifier) {
          throw new Error("reCAPTCHA verifier not initialized.");
        }
        const result = await signInWithPhoneNumber(auth, phone, appVerifier);
        setConfirmationResult(result);
        toast({ title: 'Verification code sent!', description: `A code has been sent to ${phone}.` });
      } catch (error: any) {
          console.error("Phone auth error:", error);
          setPhoneAuthError(error.message || 'Failed to send verification code. Please check the number and try again.');
          // Reset reCAPTCHA on error
          if ((window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier.render().then((widgetId: any) => {
                (window as any).grecaptcha.reset(widgetId);
            });
          }
      } finally {
          setIsSendingOtp(false);
      }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!confirmationResult) return;
      setPhoneAuthError(null);
      setIsVerifyingOtp(true);
      try {
          await confirmationResult.confirm(otp);
          toast({ title: 'Phone Login Successful!', description: "You've successfully signed in." });
          const timer = setTimeout(() => {
              router.replace('/');
          }, 1500);
          return () => clearTimeout(timer);
      } catch (error: any) {
          console.error("OTP verification error:", error);
          setPhoneAuthError(error.message || 'Invalid verification code. Please try again.');
      } finally {
          setIsVerifyingOtp(false);
      }
  };


  return (
    <Card className="w-full max-w-sm">
       <div ref={recaptchaContainerRef}></div>
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Choose a sign-in method to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {state.message && !state.success && (
          <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
            <AlertTitle>Login Failed</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        <GoogleSignInButton />

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                Or continue with
                </span>
            </div>
        </div>
        
        {/* Phone Auth */}
        {!confirmationResult ? (
          <form onSubmit={handleSendOtp} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+1 123 456 7890" required value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isSendingOtp} />
              </div>
              <Button type="submit" className="w-full" disabled={isSendingOtp}>
                {isSendingOtp ? 'Sending Code...' : 'Login with Phone'}
              </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="grid gap-4">
             <div className="grid gap-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input id="otp" name="otp" type="text" placeholder="Enter 6-digit code" required value={otp} onChange={(e) => setOtp(e.target.value)} disabled={isVerifyingOtp} />
              </div>
              <Button type="submit" className="w-full" disabled={isVerifyingOtp}>
                {isVerifyingOtp ? 'Verifying...' : 'Verify & Sign In'}
              </Button>
              <Button variant="link" size="sm" onClick={() => setConfirmationResult(null)}>
                Back to other login methods
              </Button>
          </form>
        )}
        {phoneAuthError && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Phone Sign-In Failed</AlertTitle>
                <AlertDescription>{phoneAuthError}</AlertDescription>
            </Alert>
        )}

        <Separator />

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
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

    