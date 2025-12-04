'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SubscriptionStatus } from '@prisma/client';
import {
  getSubscriptionStatusLabel,
  hasValidSubscription,
} from '@/lib/subscription-helpers';
import { InfoAlert } from '@/components/info-alert';
import { syncSubscriptionAction } from '@/server-actions/subscription';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

interface SubscriptionCardProps {
  subscription: {
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    subscription_status: SubscriptionStatus | null;
    subscription_end_date: Date | null;
  } | null;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const t = useTranslations('app');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const hasSub =
    subscription &&
    hasValidSubscription(subscription as any) &&
    subscription.stripe_customer_id;

  const handleManageSubscription = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create portal session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  const handleSyncSubscription = async () => {
    setSyncing(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await syncSubscriptionAction();

      if (!result.success) {
        throw new Error(result.error || 'Failed to sync subscription');
      }

      setSuccess('Subscription synced successfully');
      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSyncing(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('subscriptionTitle')}</CardTitle>
        <CardDescription>{t('subscriptionDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <InfoAlert message={error} type="error" />}
        {success && <InfoAlert message={success} type="success" />}

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('status')}</span>
            <span className="font-medium">
              {subscription?.subscription_status
                ? t(
                    getSubscriptionStatusLabel(subscription.subscription_status)
                  )
                : t('free')}
            </span>
          </div>

          {subscription?.subscription_end_date && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {subscription.subscription_status ===
                SubscriptionStatus.canceled
                  ? t('accessUntil')
                  : t('nextBillingDate')}
              </span>
              <span className="font-medium">
                {formatDate(subscription.subscription_end_date)}
              </span>
            </div>
          )}

          {!hasSub && (
            <p className="text-sm text-muted-foreground pt-2">
              {t('freeAccountMessage')}
            </p>
          )}
        </div>

        {hasSub && (
          <div className="flex gap-2">
            <Button
              onClick={handleManageSubscription}
              disabled={loading || syncing}
              className="flex-1"
            >
              {loading ? t('loading') : t('manageSubscription')}
            </Button>
            <Button
              onClick={handleSyncSubscription}
              disabled={loading || syncing}
              variant="outline"
              size="icon"
              title="Sync subscription from Stripe"
            >
              <RefreshCw className={syncing ? 'animate-spin h-4 w-4' : 'h-4 w-4'} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
