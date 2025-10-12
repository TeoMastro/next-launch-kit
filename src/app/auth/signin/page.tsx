import { SigninForm } from '@/components/auth/signin-form';
import { getTranslations } from 'next-intl/server';

interface SignInPageProps {
  searchParams: Promise<{ error?: string; message?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const t = await getTranslations('app');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('welcomeBack')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('signInToAccount')}
          </p>
        </div>
        <SigninForm error={params.error} message={params.message} />
      </div>
    </div>
  );
}
