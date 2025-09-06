import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  let locale = (await cookieStore).get('locale')?.value || 'en';

  if (!['en', 'el'].includes(locale)) {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
