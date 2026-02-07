'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Calendar, Mail, Shield, Trash2 } from 'lucide-react';
import { UserViewProps } from '@/types/user';
import { getStatusBadge } from '@/components/admin/user-table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteUserAction } from '@/server-actions/user';
import { InfoAlert } from '@/components/info-alert';

export function UserView({ user }: UserViewProps) {
  const router = useRouter();
  const t = useTranslations('app');

  const statusBadge = getStatusBadge(user.status, t);

  const [deleteError, setDeleteError] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/user')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{t('viewUser')}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/user/${user.id}/update`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('deleteUserConfirmation', {
                    name: `${user.first_name} ${user.last_name}`,
                  })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
                  onClick={async () => {
                    try {
                      await deleteUserAction(user.id);
                      router.push(`/admin/user?message=userDeletedSuccess`);
                    } catch (error) {
                      setDeleteError(
                        error instanceof Error
                          ? t(error.message)
                          : t('unexpectedError')
                      );
                    }
                  }}
                >
                  {t('delete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* InfoAlert for delete error */}
      {deleteError && <InfoAlert message={deleteError} type="error" />}

      {/* User Information Card */}
      <Card>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('userId')}
                </label>
                <p className="text-lg font-mono">#{user.id}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('fullName')}
                </label>
                <p className="text-lg">
                  {user.first_name} {user.last_name}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{t('email')}</span>
                </label>
                <p className="text-lg">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>{t('role')}</span>
                </label>
                <div className="mt-1">
                  <Badge
                    variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                    className="text-sm"
                  >
                    {user.role === 'ADMIN' ? t('adminRole') : t('userRole')}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('status')}
                </label>
                <div className="mt-1">
                  <Badge variant={statusBadge.variant} className="text-sm">
                    {statusBadge.text}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{t('createdAt')}</span>
              </label>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(user.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{t('updatedAt')}</span>
              </label>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(user.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
