import { test, expect } from '@playwright/test';

test.describe('Verify Email Page', () => {
  test('redirect to page without token shows error', async ({ page }) => {
    await page.goto('/auth/verify-email'); // No token param
    await page.waitForLoadState('networkidle');
    await expect(
      page.getByText(/No verification token provided/i)
    ).toBeVisible();
    await expect(page.getByText(/Verification failed/i)).toBeVisible();
  });

  test('redirect to page with invalid token shows error', async ({ page }) => {
    await page.goto('/auth/verify-email?token=invalid-token');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/Verification failed/i)).toBeVisible();
  });
});
