import { SignupForm } from '@/components/auth/signup-form';
import { getTranslations } from 'next-intl/server';

export default async function SignUpPage() {
  const t = await getTranslations('app');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('createYourAccount')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('joinUsToday')}
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
