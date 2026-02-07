import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export default async function middleware(req: NextRequest) {
  const session = (await auth.api.getSession({
    headers: req.headers,
  })) as { user: { id: string; role: string; status: string }; session: { id: string } } | null;

  // Check user status for authenticated users
  if (session?.user?.id) {
    const response = await fetch(
      `${req.nextUrl.origin}/api/check-user-status`,
      {
        headers: {
          Cookie: req.headers.get('Cookie') || '',
        },
      }
    );

    const { active } = await response.json();

    if (!active) {
      const response = NextResponse.redirect(
        new URL('/auth/signin', req.url)
      );
      response.cookies.delete('better-auth.session_token');
      response.cookies.delete('__Secure-better-auth.session_token');
      return response;
    }
  }

  if (
    req.nextUrl.pathname.startsWith('/admin') &&
    session?.user?.role !== 'ADMIN' &&
    !!session?.user
  ) {
    return NextResponse.redirect(new URL('/404', req.url));
  }

  if (
    req.nextUrl.pathname.startsWith('/profile') ||
    req.nextUrl.pathname.startsWith('/settings') ||
    req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
  }

  if (req.nextUrl.pathname.startsWith('/api')) {
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  if (req.nextUrl.pathname.startsWith('/admin') && !session) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/api/((?!auth).)*',
  ],
};
