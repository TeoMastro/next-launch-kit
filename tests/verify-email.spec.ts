import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const dbUrl =
  'postgresql://postgres:password123@localhost:5433/next_launch_kit_test';

test.describe('Verify Email Page', () => {
  test('redirect to page without token shows error', async ({ page }) => {
    await page.goto('/auth/verify-email'); // No token param
    await page.waitForLoadState('networkidle');
    await expect(
      page.getByText(/No verification token provided/i)
    ).toBeVisible();
    await expect(page.getByText(/Verification failed/i)).toBeVisible();
  });

  test('redirect to page with valid token gets success', async ({ page }) => {
    const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });
    const token = `tok_${Date.now()}`;
    const uniqueEmail = `valid${Date.now()}@example.com`;
    const hashedPassword = await bcrypt.hash('somepassword', 10);

    const user = await prisma.user.create({
      data: {
        first_name: 'Email',
        last_name: 'Verified',
        email: uniqueEmail,
        password: hashedPassword,
        status: 'UNVERIFIED',
        email_verification_token: token,
      },
    });
    await prisma.$disconnect();

    await page.goto(`/auth/verify-email?token=${token}`);
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/Email verified!/i)).toBeVisible();
    await expect(
      page.getByText(/Your email has been verified successfully!/i)
    ).toBeVisible();
  });

  test('redirect to page with invalid token gets error', async ({ page }) => {
    const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });
    const token = `notfound_${Date.now()}`;
    // Create a user with different token to ensure this is not found
    await prisma.user.create({
      data: {
        first_name: 'Email',
        last_name: 'NotFound',
        email: `invalid${Date.now()}@example.com`,
        password: await bcrypt.hash('failpassword', 10),
        status: 'UNVERIFIED',
        email_verification_token: `othertoken_${Date.now()}`,
      },
    });
    await prisma.$disconnect();

    await page.goto(`/auth/verify-email?token=${token}`);
    await page.waitForLoadState('networkidle');
    await expect(
      page.getByText(/Invalid or expired verification token/i)
    ).toBeVisible();
    await expect(page.getByText(/Verification failed/i)).toBeVisible();
  });
});
