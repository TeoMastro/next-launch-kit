import { SignupForm } from "@/components/auth/signup-form"
import { getTranslations } from 'next-intl/server';

interface SignUpPageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams
  const t = await getTranslations('SignUp');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('pageTitle')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('pageSubtitle')}
          </p>
        </div>
        <SignupForm error={params.error} />
      </div>
    </div>
  )
}