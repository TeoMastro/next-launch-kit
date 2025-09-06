import { test, expect } from '@playwright/test';

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

test('shows error for invalid email address', async ({ page }) => {
  await page.goto('/auth/signin');
  await page.locator('input#email').fill('notanemail');
  await page.locator('input#password').fill('123456');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(
    page.getByText(/Please enter a valid email address/i)
  ).toBeVisible();
});

test('shows error for short (or empty) password', async ({ page }) => {
  await page.goto('/auth/signin');
  await page.locator('input#email').fill('admin@nextlaunchkit.com');
  await page.locator('input#password').fill('123');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(
    page.getByText('Password must be at least 8 characters long')
  ).toBeVisible();
});

test('shows error for invalid credentials', async ({ page }) => {
  await page.goto('/auth/signin');
  await page.locator('input#email').fill('admin@nextlaunchkit.com');
  await page.locator('input#password').fill('wrongpassword123');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page.getByText(/Invalid email or password/i)).toBeVisible();
});
