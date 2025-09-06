import { cookies } from 'next/headers';
import enMessages from '../../messages/en.json';
import elMessages from '../../messages/el.json';

// Define the message structure type
type MessageStructure = typeof enMessages;
type Namespace = keyof MessageStructure;
type MessageKey<T extends Namespace> = keyof MessageStructure[T];

export async function getServerTranslation<T extends Namespace>(
  namespace: T,
  key: MessageKey<T>
): Promise<string> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('locale')?.value as 'en' | 'el') || 'en';

  const messages = locale === 'el' ? elMessages : enMessages;

  const translation = messages[namespace][key as keyof (typeof messages)[T]];

  return String(translation) || String(key);
}

export async function getValidationTranslation(
  key: keyof MessageStructure['Validation']
): Promise<string> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('locale')?.value as 'en' | 'el') || 'en';

  const messages = locale === 'el' ? elMessages : enMessages;
  return String(messages.Validation[key]) || String(key);
}

export async function getAuthTranslation(
  key: keyof MessageStructure['SignIn']
): Promise<string> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('locale')?.value as 'en' | 'el') || 'en';

  const messages = locale === 'el' ? elMessages : enMessages;
  return String(messages.SignIn[key]) || String(key);
}
