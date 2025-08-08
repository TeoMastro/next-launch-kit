import { test, expect } from "@playwright/test";

// No authentication for these tests
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Unauthorized Access Tests", () => {
    test("redirects non-admin users from create page", async ({ page }) => {
        await page.goto("/admin/user/create");
        await expect(page).toHaveURL(/\/(auth\/signin|signin)/);
    });

    test("redirects non-admin users from update page", async ({ page }) => {
        await page.goto("/admin/user/20/update");
        await expect(page).toHaveURL(/\/(auth\/signin|signin)/);
    });

    test("redirects non-admin users from view page", async ({ page }) => {
        await page.goto("/admin/user/21");
        await expect(page).toHaveURL(/\/(auth\/signin|signin)/);
    });
});