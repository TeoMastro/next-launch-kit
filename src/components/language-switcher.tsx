'use client';
import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const changeLanguage = (newLocale: string) => {
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`; // 1 year
    router.refresh();
  };

  return (
    <div className="flex gap-1">
      <Button
        variant={locale === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => changeLanguage('en')}
        className="px-2 py-1 text-xs"
      >
        EN
      </Button>
      <Button
        variant={locale === 'el' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => changeLanguage('el')}
        className="px-2 py-1 text-xs"
      >
        ΕΛ
      </Button>
    </div>
  );
}
