"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { useTranslations } from 'next-intl';

export default function LogoutButton() {
  const t = useTranslations('SignIn');

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <Button 
      onClick={handleLogout}
      variant="outline"
    >
      {t('signOut')}
    </Button>
  );
}