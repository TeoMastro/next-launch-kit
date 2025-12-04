import { SubscriptionStatus, User } from '@prisma/client';

export function hasActiveSubscription(user: User | null | undefined): boolean {
  if (!user) return false;

  const activeStatuses: SubscriptionStatus[] = [
    SubscriptionStatus.active,
    SubscriptionStatus.trialing,
  ];

  return (
    user.subscription_status !== null &&
    activeStatuses.includes(user.subscription_status)
  );
}

export function hasValidSubscription(
  user: User | null | undefined,
  currentTime?: Date
): boolean {
  if (!user) return false;

  if (!hasActiveSubscription(user)) return false;

  if (user.subscription_end_date) {
    const now = currentTime || new Date();
    return now < user.subscription_end_date;
  }

  return true;
}

export function isPremiumUser(
  user: User | null | undefined,
  currentTime?: Date
): boolean {
  return hasValidSubscription(user, currentTime);
}

export function isFreeUser(
  user: User | null | undefined,
  currentTime?: Date
): boolean {
  return !hasValidSubscription(user, currentTime);
}

export function getSubscriptionStatusLabel(
  status: SubscriptionStatus | null | undefined
): string {
  if (!status) return 'free';

  const statusMap: Record<SubscriptionStatus, string> = {
    [SubscriptionStatus.active]: 'subscriptionStatusActive',
    [SubscriptionStatus.canceled]: 'subscriptionStatusCanceled',
    [SubscriptionStatus.incomplete]: 'subscriptionStatusIncomplete',
    [SubscriptionStatus.incomplete_expired]:
      'subscriptionStatusIncompleteExpired',
    [SubscriptionStatus.past_due]: 'subscriptionStatusPastDue',
    [SubscriptionStatus.trialing]: 'subscriptionStatusTrialing',
    [SubscriptionStatus.unpaid]: 'subscriptionStatusUnpaid',
  };

  return statusMap[status] || 'subscriptionStatusUnknown';
}
