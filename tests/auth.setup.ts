import { test as setup } from '@playwright/test';

const adminFile = 'playwright/.auth/admin.json';
const userFile = 'playwright/.auth/user.json';

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/auth/signin');
  await page.getByLabel('Email').fill('admin@nextlaunchkit.com');
  await page.getByLabel('Password').fill('demoadmin!1');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('/dashboard');
  await page.context().storageState({ path: adminFile });
});

setup('authenticate as user', async ({ page }) => {
  await page.goto('/auth/signin');
  await page.getByLabel('Email').fill('user@nextlaunchkit.com');
  await page.getByLabel('Password').fill('demouser!1');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('/dashboard');
  await page.context().storageState({ path: userFile });
});
