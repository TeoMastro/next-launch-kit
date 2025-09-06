import LanguageSwitcher from '@/components/language-switcher';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Status } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

export default async function SettingsPage() {
  const session = await auth();

  if (!session || session?.user.status !== Status.ACTIVE) {
    redirect('/auth/signin');
  }
  const t = await getTranslations('Settings');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{t('selectLanguage')}:</span>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
