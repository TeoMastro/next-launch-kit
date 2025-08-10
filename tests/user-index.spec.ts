import { test, expect } from "@playwright/test";

test.use({ storageState: "playwright/.auth/admin.json" });

test("shows admin and user accounts in the users table", async ({ page }) => {
    await page.goto("/admin/user");
    await page.waitForLoadState("networkidle");
    
    await expect(page.locator('td').filter({ hasText: 'admin@nextlaunchkit.com' })).toBeVisible();
    await expect(page.locator('td').filter({ hasText: 'user@nextlaunchkit.com' })).toBeVisible();
    
    await expect(page.locator('td').filter({ hasText: 'Admin User' })).toBeVisible();
    await expect(page.locator('td').filter({ hasText: 'Demo User' })).toBeVisible();
});

// TODO: Add the delete test.