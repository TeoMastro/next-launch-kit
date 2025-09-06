import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Status } from '@prisma/client';

export default async function DashboardPage() {
  const session = await auth();

  if (!session || session?.user.status !== Status.ACTIVE) {
    redirect('/auth/signin');
  }

  const t = await getTranslations('Dashboard');
  return (
    <div className="container mx-auto">
      <p>{t('welcomeBack', { name: session.user.name })}</p>
    </div>
  );
}
