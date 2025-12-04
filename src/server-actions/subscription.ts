'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  stripe,
  getPriceId,
  PlanType,
  STRIPE_CONFIG,
  getSimulationTime,
} from '@/lib/stripe';
import logger from '@/lib/logger';
import { Role, Status } from '@prisma/client';

async function checkUserAuth() {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  if (session.user.role !== Role.USER) {
    throw new Error('Only USER role can subscribe');
  }

  if (session.user.status !== Status.ACTIVE) {
    throw new Error('Only ACTIVE users can subscribe');
  }

  return session;
}

export async function createCheckoutSession(planType: PlanType) {
  try {
    const session = await checkUserAuth();

    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: {
        email: true,
        stripe_customer_id: true,
        first_name: true,
        last_name: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const priceId = getPriceId(planType);

    if (!priceId) {
      throw new Error('Invalid plan type');
    }

    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customerData: any = {
        email: user.email,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        metadata: {
          userId: session.user.id.toString(),
        },
      };

      // Use test clock if configured (for testing subscription cycles)
      if (STRIPE_CONFIG.testClockId) {
        customerData.test_clock = STRIPE_CONFIG.testClockId;
      }

      const customer = await stripe.customers.create(customerData);

      customerId = customer.id;

      await prisma.user.update({
        where: { id: parseInt(session.user.id) },
        data: { stripe_customer_id: customerId },
      });

      logger.info('Stripe customer created', {
        userId: session.user.id,
        customerId,
      });
    }

    const checkoutSessionData: any = {
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.AUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.AUTH_URL}/dashboard?canceled=true`,
      subscription_data: {
        description: `Subscription for user ${session.user.id}`,
        metadata: {
          userId: session.user.id.toString(),
          planType,
        },
      },
      payment_method_collection: 'always',
      metadata: {
        userId: session.user.id.toString(),
        planType,
      },
    };

    // Add test clock to subscription if configured
    if (STRIPE_CONFIG.testClockId) {
      checkoutSessionData.subscription_data.metadata.test_clock =
        STRIPE_CONFIG.testClockId;
    }

    const checkoutSession =
      await stripe.checkout.sessions.create(checkoutSessionData);

    logger.info('Checkout session created', {
      userId: session.user.id,
      sessionId: checkoutSession.id,
      planType,
    });

    return { url: checkoutSession.url };
  } catch (error) {
    logger.error('Error creating checkout session', {
      error: (error as Error).message,
      stack: (error as Error).stack,
    });
    throw error;
  }
}

export async function createPortalSession() {
  try {
    const session = await checkUserAuth();

    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: { stripe_customer_id: true },
    });

    if (!user || !user.stripe_customer_id) {
      throw new Error('No Stripe customer found');
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.AUTH_URL}/dashboard`,
    });

    logger.info('Portal session created', {
      userId: session.user.id,
      sessionId: portalSession.id,
    });

    return { url: portalSession.url };
  } catch (error) {
    logger.error('Error creating portal session', {
      error: (error as Error).message,
      stack: (error as Error).stack,
    });
    throw error;
  }
}

export async function getUserSubscriptionAction() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: {
        stripe_customer_id: true,
        stripe_subscription_id: true,
        subscription_status: true,
        subscription_end_date: true,
      },
    });

    return user;
  } catch (error) {
    logger.error('Error fetching user subscription', {
      error: (error as Error).message,
      stack: (error as Error).stack,
    });
    return null;
  }
}

export async function getSimulationTimeAction() {
  try {
    const simulationTime = await getSimulationTime();
    const hasTestClock = !!STRIPE_CONFIG.testClockId;

    return {
      success: true,
      simulationTime: simulationTime.toISOString(),
      hasTestClock,
      testClockId: STRIPE_CONFIG.testClockId || null,
    };
  } catch (error) {
    logger.error('Error fetching simulation time', {
      error: (error as Error).message,
    });
    return {
      success: false,
      simulationTime: new Date().toISOString(),
      hasTestClock: false,
      testClockId: null,
    };
  }
}

export async function syncSubscriptionAction() {
  try {
    const session = await checkUserAuth();

    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: {
        stripe_subscription_id: true,
        stripe_customer_id: true,
      },
    });

    if (!user || !user.stripe_subscription_id) {
      return {
        success: false,
        error: 'No active subscription found',
      };
    }

    const subscription = await stripe.subscriptions.retrieve(
      user.stripe_subscription_id
    );

    const endDate = new Date(subscription.current_period_end * 1000);

    await prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data: {
        subscription_status: subscription.status as any,
        subscription_end_date: endDate,
      },
    });

    logger.info('Subscription synced manually', {
      userId: session.user.id,
      subscriptionId: subscription.id,
      status: subscription.status,
      endDate: endDate.toISOString(),
    });

    return {
      success: true,
      status: subscription.status,
      endDate: endDate.toISOString(),
    };
  } catch (error) {
    logger.error('Error syncing subscription', {
      error: (error as Error).message,
      stack: (error as Error).stack,
    });
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}
