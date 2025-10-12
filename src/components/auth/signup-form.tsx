'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { signUpAction } from '@/server-actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SignupFormState } from '@/types/auth';
import { InfoAlert } from '../info-alert';

export function SignupForm() {
  const t = useTranslations('app');

  const initialState: SignupFormState = {
    success: false,
    errors: {},
    formData: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    globalError: null,
  };

  const actionWrapper = async (
    prevState: SignupFormState,
    formData: FormData
  ): Promise<SignupFormState> => {
    return signUpAction(prevState, formData);
  };

  const [state, formAction] = useActionState(actionWrapper, initialState);

  const getErrorMessage = (field: string) => {
    const errs = state.errors[field];
    if (!errs || errs.length === 0) return null;

    return t(errs[0]);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>

      <form action={formAction} noValidate>
        <CardContent className="space-y-4 mb-5">
          {state.globalError && (
            <InfoAlert message={t(state.globalError)} type="error" />
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">{t('firstName')}</Label>
              <Input
                id="first_name"
                name="first_name"
                placeholder="John"
                defaultValue={state.formData.first_name}
                className={state.errors.first_name ? 'border-red-500' : ''}
                required
              />
              {state.errors.first_name && (
                <p className="text-sm text-red-500">
                  {getErrorMessage('first_name')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">{t('lastName')}</Label>
              <Input
                id="last_name"
                name="last_name"
                placeholder="Doe"
                defaultValue={state.formData.last_name}
                className={state.errors.last_name ? 'border-red-500' : ''}
                required
              />
              {state.errors.last_name && (
                <p className="text-sm text-red-500">
                  {getErrorMessage('last_name')}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              defaultValue={state.formData.email}
              className={state.errors.email ? 'border-red-500' : ''}
              required
            />
            {state.errors.email && (
              <p className="text-sm text-red-500">{getErrorMessage('email')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={t('passwordPlaceholder')}
              className={state.errors.password ? 'border-red-500' : ''}
              required
            />
            {state.errors.password && (
              <p className="text-sm text-red-500">
                {getErrorMessage('password')}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder={t('confirmPasswordPlaceholder')}
              className={state.errors.confirmPassword ? 'border-red-500' : ''}
              required
            />
            {state.errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {getErrorMessage('confirmPassword')}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full">
            {t('createAccount')}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t('alreadyHaveAccount')}{' '}
            <a
              href="/auth/signin"
              className="font-medium text-primary hover:underline"
            >
              {useTranslations('SignIn')('signIn')}
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
