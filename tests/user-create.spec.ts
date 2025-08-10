import { test, expect } from "@playwright/test";

test.use({ storageState: "playwright/.auth/admin.json" });

test.describe("Admin User Create Form", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/admin/user/create");
		await page.waitForLoadState("networkidle");
	});

	test("displays the create user form correctly", async ({ page }) => {
		await expect(page.getByRole("heading")).toBeVisible();

		await expect(page.getByLabel(/first name/i)).toBeVisible();
		await expect(page.getByLabel(/last name/i)).toBeVisible();
		await expect(page.getByLabel(/email/i)).toBeVisible();
		await expect(page.getByLabel(/password/i)).toBeVisible();

		await expect(page.locator('[role="combobox"]')).toBeVisible();

		await expect(
			page.getByRole("button", { name: /create/i })
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: /cancel/i })
		).toBeVisible();
	});

	test("shows validation errors for empty required fields", async ({
		page,
	}) => {
		// Submit form without filling any fields
		await page.getByRole("button", { name: /create/i }).click();

		// Wait for validation errors to appear
		await page.waitForTimeout(1000);

		// Check validation errors appear
		await expect(page.getByText(/first name is required/i)).toBeVisible();
		await expect(page.getByText(/last name is required/i)).toBeVisible();
		await expect(
			page.getByText(/please enter a valid email address/i)
		).toBeVisible();
		await expect(
			page.getByText(/password must be at least 6 characters/i)
		).toBeVisible();
	});

	test("shows error for invalid email format", async ({ page }) => {
		await page.getByLabel(/first name/i).fill("John");
		await page.getByLabel(/last name/i).fill("Doe");
		await page.getByLabel(/email/i).fill("notanemail");
		await page.getByLabel(/password/i).fill("password123");

		await page.getByRole("button", { name: /create/i }).click();

		await expect(
			page.getByText(/please enter a valid email address/i)
		).toBeVisible();
	});

	test("shows error for password too short", async ({ page }) => {
		await page.getByLabel(/first name/i).fill("John");
		await page.getByLabel(/last name/i).fill("Doe");
		await page.getByLabel(/email/i).fill("john@example.com");
		await page.getByLabel(/password/i).fill("123"); // Too short

		await page.getByRole("button", { name: /create/i }).click();

		await expect(
			page.getByText(/password must be at least 6 characters/i)
		).toBeVisible();
	});

	test("shows error when user already exists", async ({ page }) => {
		// Use existing admin email
		await page.getByLabel(/first name/i).fill("John");
		await page.getByLabel(/last name/i).fill("Doe");
		await page.getByLabel(/email/i).fill("admin@nextlaunchkit.com");
		await page.getByLabel(/password/i).fill("password123");

		await page.getByRole("button", { name: /create/i }).click();

		await expect(
			page.getByText(/user already exists with this email/i)
		).toBeVisible();
	});

	test("successfully creates a new user and redirects", async ({ page }) => {
		const uniqueEmail = `testuser${Date.now()}@example.com`;

		await page.getByLabel(/first name/i).fill("Test");
		await page.getByLabel(/last name/i).fill("User");
		await page.getByLabel(/email/i).fill(uniqueEmail);
		await page.getByLabel(/password/i).fill("testpass123");

		await page.locator('[role="combobox"]').click();
		await page.waitForTimeout(500);
		await page.getByRole("option", { name: /user/i }).click();

		await page.getByRole("button", { name: /create/i }).click();

		await page.waitForURL(/\/admin\/user/, { timeout: 10000 });

		await expect(page).toHaveURL(
			/\/admin\/user\?message=userCreatedSuccess/
		);
		await expect(
			page.getByText(/user created successfully/i)
		).toBeVisible();
	});

	test("form retains data after validation error", async ({ page }) => {
		// Fill out form with invalid email
		await page.getByLabel(/first name/i).fill("John");
		await page.getByLabel(/last name/i).fill("Doe");
		await page.getByLabel(/email/i).fill("invalidemail");
		await page.getByLabel(/password/i).fill("password123");

		await page.getByRole("button", { name: /create/i }).click();

		// Form should retain the valid data
		await expect(page.getByLabel(/first name/i)).toHaveValue("John");
		await expect(page.getByLabel(/last name/i)).toHaveValue("Doe");
		await expect(page.getByLabel(/password/i)).toHaveValue(""); // Password should be cleared
	});
});
