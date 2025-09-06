'use client';

import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export default function LogoutButton() {
  const t = useTranslations('SignIn');

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  return <a onClick={handleLogout}>{t('signOut')}</a>;
}
