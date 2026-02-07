import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Status } from '@prisma/client';

export async function GET(request: NextRequest) {
  const session = (await auth.api.getSession({
    headers: request.headers,
  })) as { user: { id: string; email: string } } | null;

  if (!session?.user?.id) {
    return NextResponse.json({ active: false });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { status: true },
  });

  return NextResponse.json({
    active: user?.status === Status.ACTIVE,
  });
}
