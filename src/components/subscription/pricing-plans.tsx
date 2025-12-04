'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlanType } from '@/lib/stripe';
import { InfoAlert } from '@/components/info-alert';

interface PricingPlansProps {
  hasActiveSubscription: boolean;
}

export function PricingPlans({ hasActiveSubscription }: PricingPlansProps) {
  const t = useTranslations('app');
  const [loading, setLoading] = useState<PlanType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (planType: PlanType) => {
    setLoading(planType);
    setError(null);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError((err as Error).message);
      setLoading(null);
    }
  };

  if (hasActiveSubscription) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">{t('upgradeToPremium')}</h2>
        <p className="text-muted-foreground">{t('choosePlan')}</p>
      </div>

      {error && <InfoAlert message={error} type="error" />}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('monthlyPlan')}</CardTitle>
            <CardDescription>{t('monthlyPlanDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="text-4xl font-bold">{t('monthlyPrice')}</span>
                <span className="text-muted-foreground">/{t('month')}</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  {t('feature1')}
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  {t('feature2')}
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  {t('feature3')}
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handleSubscribe('monthly')}
              disabled={loading !== null}
              className="w-full"
            >
              {loading === 'monthly' ? t('loading') : t('subscribe')}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {t('yearlyPlan')}
              <span className="ml-2 text-sm text-green-600 font-normal">
                {t('savePercent')}
              </span>
            </CardTitle>
            <CardDescription>{t('yearlyPlanDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="text-4xl font-bold">{t('yearlyPrice')}</span>
                <span className="text-muted-foreground">/{t('year')}</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  {t('feature1')}
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  {t('feature2')}
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  {t('feature3')}
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  {t('feature4')}
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handleSubscribe('yearly')}
              disabled={loading !== null}
              className="w-full"
              variant="default"
            >
              {loading === 'yearly' ? t('loading') : t('subscribe')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
