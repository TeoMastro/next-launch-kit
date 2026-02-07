import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const dbUrl =
  'postgresql://postgres:password123@localhost:5433/next_launch_kit_test';

async function createUserWithToken(
  email: string,
  token: string,
  expires: Date
) {
  const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });
  const user = await prisma.user.create({
    data: {
      first_name: 'Test',
      last_name: 'Reset',
      email,
      emailVerified: true,
      status: 'ACTIVE',
      password_reset_token: token,
      password_reset_expires: expires,
    },
  });
  await prisma.$disconnect();
  return user;
}

test('can reset password with valid token', async ({ page }) => {
  const email = `reset${Date.now()}@example.com`;
  const token = `reset-token-${Date.now()}`;
  const expires = new Date(Date.now() + 60 * 60 * 1000); // expires in 1 hour
  await createUserWithToken(email, token, expires);

  await page.goto(`/auth/reset-password?token=${token}`);
  await page.waitForLoadState('networkidle');

  await page.getByLabel(/new password/i).fill('newpassword456');
  await page.getByLabel(/confirm password/i).fill('newpassword456');
  await page.getByRole('button', { name: /reset password/i }).click();

  await expect(page).toHaveURL(/auth\/signin/);
  await expect(
    page.getByText(/password has been reset successfully/i)
  ).toBeVisible();
});

test('shows error for invalid/expired token', async ({ page }) => {
  await page.goto('/auth/reset-password?token=badtoken');
  await page.waitForLoadState('networkidle');

  await page.getByLabel(/new password/i).fill('newpassword123');
  await page.getByLabel(/confirm password/i).fill('newpassword123');

  await page.getByRole('button', { name: /reset password/i }).click();

  await expect(page.getByText(/invalid or expired reset token/i)).toBeVisible();
});
