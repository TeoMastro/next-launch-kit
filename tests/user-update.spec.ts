import { test, expect } from "@playwright/test";

// Use the authenticated state for admin tests
test.use({ storageState: "playwright/.auth/user.json" });

test.describe("Admin User Update Form", () => {
	// Using a test user ID - you might need to adjust this based on your test data
	const testUserId = 20;

	test.beforeEach(async ({ page }) => {
		await page.goto(`/admin/user/${testUserId}/update`);
		await page.waitForLoadState("networkidle");
	});

	test("displays the update user form correctly", async ({ page }) => {
		await expect(page.getByRole("heading")).toBeVisible();

		await expect(page.getByLabel(/first name/i)).toBeVisible();
		await expect(page.getByLabel(/last name/i)).toBeVisible();
		await expect(page.getByLabel(/email/i)).toBeVisible();
		await expect(page.getByLabel(/password/i)).toBeVisible();

		await expect(page.locator('[role="combobox"]')).toBeVisible();

		await expect(
			page.getByRole("button", { name: /update/i })
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: /cancel/i })
		).toBeVisible();

		// Check that form is pre-populated with existing user data
		await expect(page.getByLabel(/first name/i)).not.toHaveValue("");
		await expect(page.getByLabel(/last name/i)).not.toHaveValue("");
		await expect(page.getByLabel(/email/i)).not.toHaveValue("");
		// Password should be empty in update mode
		await expect(page.getByLabel(/password/i)).toHaveValue("");
	});

	test("shows validation errors for empty required fields", async ({
		page,
	}) => {
		await page.waitForLoadState("networkidle");
		await expect(page.getByRole("heading")).toBeVisible();

		await page.getByLabel(/first name/i).fill("");
		await page.getByLabel(/last name/i).fill("");
		await page.getByLabel(/email/i).fill("");

		await page.getByRole("button", { name: /update/i }).click();

		await page.waitForTimeout(1000);

		await expect(page.getByText(/first name is required/i)).toBeVisible();
		await expect(page.getByText(/last name is required/i)).toBeVisible();
		await expect(
			page.getByText(/please enter a valid email address/i)
		).toBeVisible();
	});

	test("shows error for invalid email format", async ({ page }) => {
		await page.getByLabel(/first name/i).fill("John");
		await page.getByLabel(/last name/i).fill("Doe");
		await page.getByLabel(/email/i).fill("notanemail");
		// Leave password empty (should be allowed in update mode)

		await page.getByRole("button", { name: /update/i }).click();

		await expect(
			page.getByText(/please enter a valid email address/i)
		).toBeVisible();
	});

	test("shows error for password too short when password is provided", async ({
		page,
	}) => {
		await page.getByLabel(/first name/i).fill("John");
		await page.getByLabel(/last name/i).fill("Doe");
		await page.getByLabel(/email/i).fill("john@example.com");
		await page.getByLabel(/password/i).fill("123"); // Too short

		await page.getByRole("button", { name: /update/i }).click();

		await expect(
			page.getByText(/password must be at least 6 characters/i)
		).toBeVisible();
	});

	test("allows empty password in update mode", async ({ page }) => {
		await page.getByLabel(/first name/i).fill("UpdatedFirst");
		await page.getByLabel(/last name/i).fill("UpdatedLast");
		// Keep existing email and leave password empty

		await page.getByRole("button", { name: /update/i }).click();

		// Should not show password validation error
		await expect(
			page.getByText(/password must be at least 6 characters/i)
		).not.toBeVisible();

		// Should redirect successfully
		await page.waitForURL(/\/admin\/user/, { timeout: 10000 });
		await expect(page).toHaveURL(
			/\/admin\/user\?message=userUpdatedSuccess/
		);
	});

	test("shows error when email is already taken by another user", async ({
		page,
	}) => {
		// Try to use the admin email (assuming it belongs to a different user)
		await page.getByLabel(/first name/i).fill("John");
		await page.getByLabel(/last name/i).fill("Doe");
		await page.getByLabel(/email/i).fill("admin@nextlaunchkit.com");

		await page.getByRole("button", { name: /update/i }).click();

		await expect(
			page.getByText(/email is already taken by another user/i)
		).toBeVisible();
	});

	test("successfully updates user and redirects", async ({ page }) => {
		const updatedFirstName = `Updated${Date.now()}`;
		const updatedLastName = `User${Date.now()}`;

		await page.getByLabel(/first name/i).fill(updatedFirstName);
		await page.getByLabel(/last name/i).fill(updatedLastName);
		// Keep existing email or use a unique one
		await page
			.getByLabel(/email/i)
			.fill(`updated${Date.now()}@example.com`);

		// Select role
		await page.locator('[role="combobox"]').click();
		await page.waitForTimeout(500);
		await page.getByRole("option", { name: /user/i }).click();

		await page.getByRole("button", { name: /update/i }).click();

		await page.waitForURL(/\/admin\/user/, { timeout: 10000 });

		await expect(page).toHaveURL(
			/\/admin\/user\?message=userUpdatedSuccess/
		);
		await expect(
			page.getByText(/user updated successfully/i)
		).toBeVisible();
	});

	test("successfully updates user with new password", async ({ page }) => {
		const updatedFirstName = `UpdatedPass${Date.now()}`;

		await page.getByLabel(/first name/i).fill(updatedFirstName);
		await page.getByLabel(/password/i).fill("newpassword123");

		await page.getByRole("button", { name: /update/i }).click();

		await page.waitForURL(/\/admin\/user/, { timeout: 10000 });

		await expect(page).toHaveURL(
			/\/admin\/user\?message=userUpdatedSuccess/
		);
		await expect(
			page.getByText(/user updated successfully/i)
		).toBeVisible();
	});

	test("form retains data after validation error", async ({ page }) => {
		// Fill out form with invalid email
		await page.getByLabel(/first name/i).fill("RetainedFirst");
		await page.getByLabel(/last name/i).fill("RetainedLast");
		await page.getByLabel(/email/i).fill("invalidemail");
		await page.getByLabel(/password/i).fill("validpassword123");

		await page.getByRole("button", { name: /update/i }).click();

		// Form should retain the valid data
		await expect(page.getByLabel(/first name/i)).toHaveValue(
			"RetainedFirst"
		);
		await expect(page.getByLabel(/last name/i)).toHaveValue("RetainedLast");
		await expect(page.getByLabel(/password/i)).toHaveValue(""); // Password should be cleared
	});

	test("displays password hint text for update mode", async ({ page }) => {
		// Check that the password field shows the hint about leaving empty
		await expect(
			page.getByText(/leave empty to keep current/i)
		).toBeVisible();
	});

	test("can change user role", async ({ page }) => {
		// Click role selector
		await page.locator('[role="combobox"]').click();
		await page.waitForTimeout(500);

		// Check both options are available
		await expect(page.getByRole("option", { name: /user/i })).toBeVisible();
		await expect(
			page.getByRole("option", { name: /admin/i })
		).toBeVisible();

		// Select admin role
		await page.getByRole("option", { name: /admin/i }).click();

		// Verify selection
		await expect(page.locator('[role="combobox"]')).toContainText(/admin/i);
	});
});

// Test for non-existent user
test.describe("Admin User Update Form - Non-existent User", () => {
	test.use({ storageState: "playwright/.auth/user.json" });

	test("handles non-existent user gracefully", async ({ page }) => {
		// Use a user ID that likely doesn't exist
		await page.goto("/admin/user/99999/update");

		// Should show 404 or redirect, depending on your error handling
		// Adjust this based on how your app handles non-existent users
		await expect(page).toHaveURL(/\/(404|admin\/user)/);
	});
});
