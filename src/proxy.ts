import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth(async (req) => {
  const session = req.auth;

  // trigger an api call internally to check the user's status.
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
      const response = NextResponse.redirect(new URL('/auth/signin', req.url));
      response.cookies.delete('authjs.session-token');
      response.cookies.delete('__Secure-authjs.session-token');
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
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/api/((?!auth).)*',
  ],
};
