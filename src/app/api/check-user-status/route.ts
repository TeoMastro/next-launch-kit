import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Status } from '@prisma/client';

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ active: false });
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
    select: { status: true },
  });

  return NextResponse.json({
    active: user?.status === Status.ACTIVE,
  });
}
