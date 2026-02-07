import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export interface AuthSession {
  session: {
    id: string;
    userId: number;
    token: string;
    expiresAt: Date;
  };
  user: {
    id: number;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
    status: string;
    first_name: string | null;
    last_name: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

export async function getSession(): Promise<AuthSession | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  return session as unknown as AuthSession;
}
