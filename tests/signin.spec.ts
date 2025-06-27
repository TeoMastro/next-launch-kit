import { test, expect } from '@playwright/test';

// Test without authentication to verify sign-in flow
test.use({ storageState: { cookies: [], origins: [] } });

test('should sign in successfully', async ({ page }) => {
  // Navigate to a protected page that should redirect to sign-in
  await page.goto('/dashboard');
  
  // Should be redirected to sign-in page
  await expect(page).toHaveURL(/.*signin.*/);
  
  // Fill in credentials. These should be some actual demo users.
  await page.getByLabel('Email').fill('admin@nextlaunchkit.com');
  await page.getByLabel('Password').fill('demoadmin!1');
  
  // Submit the form
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Should be redirected to the protected page
  await expect(page).toHaveURL('/dashboard');
  
  // Verify successful authentication
  await expect(page.getByText('Welcome')).toBeVisible();
});
