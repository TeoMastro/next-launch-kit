import { NextRequest, NextResponse } from 'next/server';
import { createPortalSession } from '@/server-actions/subscription';

export async function POST(request: NextRequest) {
  try {
    const result = await createPortalSession();

    if (!result.url) {
      return NextResponse.json(
        { error: 'Failed to create portal session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    );
  }
}
