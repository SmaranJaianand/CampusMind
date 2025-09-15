
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
import { useEffect, useState, useRef } from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { auth, googleProvider } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup } from 'firebase/auth';
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
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp]_useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  
  type AuthMethod = 'email' | 'phone' | null;
  const [authMethod, setAuthMethod] = useState<AuthMethod>(null);

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
  
  const setupRecaptcha = () => {
    if (!recaptchaContainerRef.current) return;
    if ((window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier.clear();
    }
    const verifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        'size': 'invisible',
        'callback': () => {},
    });
    (window as any).recaptchaVerifier = verifier;
    return verifier;
  }
  
  const handleGoogleSignUp = async () => {
    setAuthError(null);
    try {
        await signInWithPopup(auth, googleProvider);
        toast({
            title: "Account Created!",
            description: "You've successfully signed up with Google.",
        });
        router.replace('/');
    } catch (error: any) {
        setAuthError('Failed to sign up with Google. Please try again.');
        console.error(error);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError(null);
      setIsSendingOtp(true);
      
      if (!/^\+[1-9]\d{1,14}$/.test(phone)) {
        setAuthError("Invalid phone number format. Please use E.164 format (e.g., +11234567890).");
        setIsSendingOtp(false);
        return;
      }

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
          setAuthError(error.message || 'Failed to send verification code. Please check the number and try again.');
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
      setAuthError(null);
      setIsVerifyingOtp(true);
      try {
          await confirmationResult.confirm(otp);
          toast({ title: 'Account Created!', description: "You've successfully signed up with your phone number." });
          router.replace('/');
      } catch (error: any) {
          console.error("OTP verification error:", error);
          setAuthError(error.message || 'Invalid verification code. Please try again.');
      } finally {
          setIsVerifyingOtp(false);
      }
  };

  const renderAuthMethod = () => {
    if (authMethod === 'email') {
      return (
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
      )
    }
    
    if (authMethod === 'phone') {
       return !confirmationResult ? (
          <form onSubmit={handleSendOtp} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+11234567890" required value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isSendingOtp} />
              </div>
              <Button type="submit" className="w-full" disabled={isSendingOtp}>
                {isSendingOtp ? 'Sending Code...' : 'Send Verification Code'}
              </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="grid gap-4">
             <div className="grid gap-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input id="otp" name="otp" type="text" placeholder="Enter 6-digit code" required value={otp} onChange={(e) => setOtp(e.target.value)} disabled={isVerifyingOtp} />
              </div>
              <Button type="submit" className="w-full" disabled={isVerifyingOtp}>
                {isVerifyingOtp ? 'Verifying...' : 'Verify & Sign Up'}
              </Button>
          </form>
        )
    }
    
    return (
        <div className="grid gap-4">
            <Button variant="outline" type="button" className="w-full" onClick={handleGoogleSignUp}>
                 <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.7 0 265.2 0 128.5 110.3 18.2 244 18.2c71.2 0 130.3 27.8 174.2 68.9l-65.7 64.3C308.1 120.9 278.4 104 244 104c-63.9 0-116.3 52.4-116.3 116.3s52.4 116.3 116.3 116.3c70.4 0 98.8-52.8 102.7-77.9H244V261.8h244z"></path></svg>
                Sign up with Google
            </Button>
             <Button variant="outline" type="button" className="w-full" onClick={() => setAuthMethod('phone')}>
                Sign up with Phone
            </Button>
             <Button variant="outline" type="button" className="w-full" onClick={() => setAuthMethod('email')}>
                Sign up with Email
            </Button>
        </div>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <div ref={recaptchaContainerRef}></div>
      <CardHeader>
        {authMethod && (
            <Button variant="ghost" size="sm" className="absolute top-4 left-4 h-7 w-7 p-0" onClick={() => { setAuthMethod(null); setConfirmationResult(null); setAuthError(null); }}>
                <ArrowLeft className="h-5 w-5" />
            </Button>
        )}
        <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
        <CardDescription className="text-center">
            {authMethod ? `Use your ${authMethod} to create an account.` : 'Choose a sign-up method.'}
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
        {authError && (
            <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Sign-Up Failed</AlertTitle>
            <AlertDescription>{authError}</AlertDescription>
        </Alert>
        )}

        {renderAuthMethod()}

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
