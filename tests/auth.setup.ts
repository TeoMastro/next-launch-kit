import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Navigate to your Next-Auth sign-in page
  await page.goto('/auth/signin'); 

  // Fill in your authentication credentials
  await page.getByLabel('Email').fill('admin@nextlaunchkit.com');
  await page.getByLabel('Password').fill('demoadmin!1');
  
  // Click the sign-in button
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Wait for successful authentication
  await page.waitForURL('/dashboard');
  
  // Verify successful login
  await expect(page.getByText('Welcome')).toBeVisible();
  
  // Save the authentication state
  await page.context().storageState({ path: authFile });
});

