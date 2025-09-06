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
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { resetPasswordAction } from '@/server-actions/auth';
import { ResetPasswordState } from '@/types/auth';
import { InfoAlert } from '../info-alert';

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations('ResetPassword');
  const tSignIn = useTranslations('SignIn');
  const tValidation = useTranslations('Validation');

  const initialState: ResetPasswordState = {
    errors: {},
    success: false,
    formData: { password: '', confirmPassword: '' },
    globalError: null,
  };

  const [state, formAction] = useActionState(
    resetPasswordAction.bind(null, token),
    initialState
  );

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    formAction(formData);
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t('setNewPassword')}</CardTitle>
      </CardHeader>

      <form action={handleSubmit} noValidate>
        <CardContent className="space-y-4 mb-5">
          {state.globalError && (
            <InfoAlert message={t(state.globalError)} type="error" />
          )}

          <div className="space-y-2">
            <Label htmlFor="password">{t('newPassword')}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={t('enterNewPassword')}
              disabled={isSubmitting}
              defaultValue={state.formData?.password || ''}
              className={state.errors.password ? 'border-red-500' : ''}
            />
            {state.errors.password && (
              <p className="text-sm text-red-500">
                {tValidation(state.errors.password[0])}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder={t('confirmNewPassword')}
              disabled={isSubmitting}
              defaultValue={state.formData?.confirmPassword || ''}
              className={state.errors.confirmPassword ? 'border-red-500' : ''}
            />
            {state.errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {tValidation(state.errors.confirmPassword[0])}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('resetting') : t('resetPassword')}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t('rememberPassword')}{' '}
            <a
              href="/auth/signin"
              className="font-medium text-primary hover:underline"
            >
              {tSignIn('signIn')}
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
