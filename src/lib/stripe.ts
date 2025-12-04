import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
  typescript: true,
});

export const STRIPE_CONFIG = {
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  priceIdMonthly: process.env.STRIPE_PRICE_ID_MONTHLY || '',
  priceIdYearly: process.env.STRIPE_PRICE_ID_YEARLY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  testClockId: process.env.STRIPE_TEST_CLOCK_ID || '',
};

export type PlanType = 'monthly' | 'yearly';

export function getPriceId(planType: PlanType): string {
  return planType === 'monthly'
    ? STRIPE_CONFIG.priceIdMonthly
    : STRIPE_CONFIG.priceIdYearly;
}

/**
 * Gets the current simulation time from Stripe test clock if configured,
 * otherwise returns the current time
 */
export async function getSimulationTime(): Promise<Date> {
  if (!STRIPE_CONFIG.testClockId) {
    return new Date();
  }

  try {
    const testClock = await stripe.testHelpers.testClocks.retrieve(
      STRIPE_CONFIG.testClockId
    );
    return new Date(testClock.frozen_time * 1000);
  } catch (error) {
    console.error('Error fetching test clock:', error);
    return new Date();
  }
}
