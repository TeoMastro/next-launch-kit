import { getAuthSession } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { Status } from '@prisma/client';

export default async function ProfilePage() {
  const session = await getAuthSession();
  if (!session || session?.user.status !== Status.ACTIVE) {
    redirect('/auth/signin');
  }
  const t = await getTranslations('Profile');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-4">{t('userInformation')}</h3>
        <div className="space-y-2">
          <p>
            <strong>{t('id')}:</strong> {session?.user.id}
          </p>
          <p>
            <strong>{t('name')}:</strong> {session?.user.name}
          </p>
          <p>
            <strong>Email:</strong> {session?.user.email}
          </p>
          <p>
            <strong>{t('role')}:</strong> {session?.user.role}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-4">{t('accountDetails')}</h3>
        <div className="space-y-2">
          <p>
            <strong>{t('accountType')}:</strong> {session?.user.role}
          </p>
          <p>
            <strong>{t('status')}:</strong>{' '}
            <span className="text-green-600">{t('active')}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
