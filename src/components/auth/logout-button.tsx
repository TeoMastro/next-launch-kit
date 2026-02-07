'use client';

import { authClient } from '@/lib/auth-client';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const t = useTranslations('app');
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/auth/signin');
        },
      },
    });
  };

  return <a onClick={handleLogout}>{t('signOut')}</a>;
}
