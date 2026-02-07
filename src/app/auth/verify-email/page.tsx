'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { authClient } from '@/lib/auth-client';
import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { InfoAlert } from '@/components/info-alert';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const t = useTranslations('app');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');

  const handleVerification = useCallback(
    async (token: string) => {
      try {
        const result = await authClient.verifyEmail({
          query: { token },
        });

        if (result.error) {
          setStatus('error');
          setMessage(t('verificationError'));
        } else {
          setStatus('success');
          setMessage(t('verificationSuccess'));
          setTimeout(
            () =>
              router.push(
                '/auth/signin?message=' +
                  encodeURIComponent(t('verificationSuccessRedirect'))
              ),
            3000
          );
        }
      } catch (error) {
        setStatus('error');
        setMessage(t('verificationFailed'));
      }
    },
    [t, router]
  );

  useEffect(() => {
    if (token) {
      handleVerification(token);
    } else {
      setStatus('error');
      setMessage(t('noTokenError'));
    }
  }, [token, t, handleVerification]);

  const handleBackToLogin = () => {
    router.push('/auth/signin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {t('pageTitle')}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('pageSubtitle')}
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            {status === 'loading' && (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <CardTitle>{t('verifying')}</CardTitle>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-green-600 dark:text-green-400">
                    {t('successTitle')}
                  </CardTitle>
                  <CardDescription className="mt-2">{message}</CardDescription>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-red-600 dark:text-red-400">
                    {t('errorTitle')}
                  </CardTitle>
                  <CardDescription className="mt-2">{message}</CardDescription>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {status === 'success' && (
              <InfoAlert message={t('redirectingMessage')} type="success" />
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <InfoAlert message={t('verificationFailed')} type="error" />
                <Button
                  onClick={handleBackToLogin}
                  className="w-full"
                  variant="default"
                >
                  {t('backToLoginButton')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
