import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/server-actions/subscription';
import { PlanType } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planType } = body as { planType: PlanType };

    if (!planType || (planType !== 'monthly' && planType !== 'yearly')) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    const result = await createCheckoutSession(planType);

    if (!result.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    );
  }
}
