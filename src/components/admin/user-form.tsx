'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { createUserAction, updateUserAction } from '@/server-actions/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserFormProps, UserFormState } from '@/types/user';
import { Role, Status } from '@prisma/client';
import { InfoAlert } from '../info-alert';

export function UserForm({ user, mode }: UserFormProps) {
  const t = useTranslations('app');

  const initialState: UserFormState = {
    success: false,
    errors: {},
    formData: {
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      email: user?.email || '',
      password: '',
      role: user?.role || Role.USER,
      status: user?.status || Status.ACTIVE,
    },
    globalError: null,
  };

  const actionWrapper = async (
    prevState: UserFormState,
    formData: FormData
  ): Promise<UserFormState> => {
    if (mode === 'create') {
      return createUserAction(prevState, formData);
    } else {
      return updateUserAction(user!.id, prevState, formData);
    }
  };

  const [state, formAction] = useActionState(actionWrapper, initialState);

  const getErrorMessage = (field: string) => {
    const errs = state.errors[field];
    if (!errs || errs.length === 0) return null;
    return t(errs[0]);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? t('createUser') : t('updateUser')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} noValidate className="space-y-4">
          {state.globalError && (
            <InfoAlert message={t(state.globalError)} type="error" />
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">{t('firstName')}</Label>
              <Input
                id="first_name"
                name="first_name"
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
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={state.formData.email}
              className={state.errors.email ? 'border-red-500' : ''}
              required
            />
            {state.errors.email && (
              <p className="text-sm text-red-500">{getErrorMessage('email')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {t('password')}
              {mode === 'update' && (
                <span className="text-sm text-muted-foreground ml-2">
                  ({t('leaveEmptyToKeepCurrent')})
                </span>
              )}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              className={state.errors.password ? 'border-red-500' : ''}
              required={mode === 'create'}
            />
            {state.errors.password && (
              <p className="text-sm text-red-500">
                {getErrorMessage('password')}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">{t('role')}</Label>
              <Select name="role" defaultValue={state.formData.role}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectRole')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">{t('userRole')}</SelectItem>
                  <SelectItem value="ADMIN">{t('adminRole')}</SelectItem>
                </SelectContent>
              </Select>
              {state.errors.role && (
                <p className="text-sm text-red-500">
                  {getErrorMessage('role')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t('status')}</Label>
              <Select name="status" defaultValue={state.formData.status}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">{t('activeStatus')}</SelectItem>
                  <SelectItem value="INACTIVE">
                    {t('inactiveStatus')}
                  </SelectItem>
                  <SelectItem value="UNVERIFIED">
                    {t('unverifiedStatus')}
                  </SelectItem>
                </SelectContent>
              </Select>
              {state.errors.status && (
                <p className="text-sm text-red-500">
                  {getErrorMessage('status')}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit">
              {mode === 'create' ? t('create') : t('update')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              {t('cancel')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
