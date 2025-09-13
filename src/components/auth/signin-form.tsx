'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { signIn } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { validateSigninData } from '@/server-actions/auth';
import { ValidationState } from '@/types/auth';
import Link from 'next/link';
import { InfoAlert } from '../info-alert';

interface LoginFormProps {
  error?: string;
  message?: string;
}

export function SigninForm({ error, message }: LoginFormProps) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showMessage, setShowMessage] = useState(!!message);
  const router = useRouter();
  const t = useTranslations('SignIn');
  const tValidation = useTranslations('Validation');

  const initialState: ValidationState = {
    errors: {},
    data: null,
    success: false,
    formData: { email: '', password: '' },
  };

  const [state, formAction] = useActionState(validateSigninData, initialState);
  const handleAuthentication = useCallback(async (data: {
      email: string;
      password: string;
    }) => {
      setIsSigningIn(true);
      setAuthError('');
      setShowMessage(false);

      try {
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          setAuthError(t('invalidCredentials'));
        } else if (result?.ok) {
          router.push('/dashboard');
          router.refresh();
        }
      } catch (error) {
        setAuthError(t('somethingWentWrong'));
      } finally {
        setIsSigningIn(false);
      }
    }, [t, router]);

  const handleGoogleSignIn = () => {
    signIn('google', {
      redirectTo: '/dashboard',
    });
  };
  useEffect(() => {
    if (state.success && state.data) {
      handleAuthentication(state.data);
    }
  }, [state, handleAuthentication]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t('signIn')}</CardTitle>
      </CardHeader>

      <form action={formAction} noValidate>
        <CardContent className="space-y-4 mb-5">
          {(error || authError) && (
            <InfoAlert message={error || authError} type="error" />
          )}

          {message && showMessage && (
            <InfoAlert message={message} type="success" />
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t('enterEmail')}
              disabled={isSigningIn}
              defaultValue={state.formData?.email || ''}
              className={state.errors.email ? 'border-red-500' : ''}
            />
            {state.errors.email && (
              <p className="text-sm text-red-500">
                {tValidation(state.errors.email[0])}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={t('enterPassword')}
              disabled={isSigningIn}
              defaultValue={state.formData?.password || ''}
              className={state.errors.password ? 'border-red-500' : ''}
            />
            {state.errors.password && (
              <p className="text-sm text-red-500">
                {tValidation(state.errors.password[0])}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              {t('forgotPassword')}
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isSigningIn}>
            {t('signIn')}
          </Button>

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

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t('dontHaveAccount')}{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-primary hover:underline"
            >
              {t('signUp')}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
