import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams
  const t = await getTranslations('ResetPassword');
  
  if (!params.token) {
    redirect('/auth/forgot-password')
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('resetPassword')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('enterNewPassword')}
          </p>
        </div>
        <ResetPasswordForm token={params.token} />
      </div>
    </div>
  )
}
