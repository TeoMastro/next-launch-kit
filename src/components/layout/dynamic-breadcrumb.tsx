'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';

export function DynamicBreadcrumb() {
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('app');

  useEffect(() => {
    setIsHydrated(true);
  }, [pathname]);

  const pathSegments = pathname
    .split('/')
    .filter(Boolean)
    .filter((segment) => segment !== 'admin');

  const isIdSegment = (segment: string) => {
    if (/^\d+$/.test(segment)) return true;
    return false;
  };

  const formatSegmentName = (segment: string) => {
    if (isIdSegment(segment)) {
      return segment;
    }

    const formatted = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    if (!isHydrated) return formatted;

    try {
      return t(segment) || formatted;
    } catch {
      return formatted;
    }
  };

  if (!isHydrated) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  if (pathname === '/dashboard') {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{t('home')}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">{t('home')}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathSegments.map((segment, index) => {
          const allSegments = pathname.split('/').filter(Boolean);
          const adminIndex = allSegments.indexOf('admin');
          let href = '/';

          // If admin is in the first segment of our pathname, use it in the actual url.
          if (adminIndex !== -1) {
            const segmentsForHref = allSegments.slice(
              0,
              allSegments.indexOf(segment) + 1
            );
            href = '/' + segmentsForHref.join('/');
          } else {
            href = '/' + pathSegments.slice(0, index + 1).join('/');
          }

          const isLast = index === pathSegments.length - 1;
          const displayName = formatSegmentName(segment);

          return (
            <Fragment key={`breadcrumb-${segment}-${index}`}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{displayName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{displayName}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
