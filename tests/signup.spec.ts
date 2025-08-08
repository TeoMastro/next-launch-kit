import { test, expect } from "@playwright/test";

test.describe("Signup form validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/signup");
  });

  test("shows error when first name is missing or too short", async ({ page }) => {
    // Missing first name (empty)
    await page.locator('input#first_name').fill('');
    await page.locator('input#last_name').fill('Doe');
    await page.locator('input#email').fill('user@example.com');
    await page.locator('input#password').fill('Demopass1!');
    await page.locator('input#confirmPassword').fill('Demopass1!');
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page.getByText("First name must be at least 2 characters long").first()).toBeVisible();

    // Too short first name
    await page.locator('input#first_name').fill('J');
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page.getByText("First name must be at least 2 characters long")).toBeVisible();
  });

  test("shows error when last name is missing or too short", async ({ page }) => {
    await page.locator('input#first_name').fill('John');
    await page.locator('input#last_name').fill(''); // empty
    await page.locator('input#email').fill('user@example.com');
    await page.locator('input#password').fill('Demopass1!');
    await page.locator('input#confirmPassword').fill('Demopass1!');
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page.getByText("Last name must be at least 2 characters long").first()).toBeVisible();

    // Too short last name
    await page.locator('input#last_name').fill('D');
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page.getByText("Last name must be at least 2 characters long")).toBeVisible();
  });

  test("shows error for invalid email", async ({ page }) => {
    await page.locator('input#first_name').fill('John');
    await page.locator('input#last_name').fill('Doe');
    await page.locator('input#email').fill('notanemail');
    await page.locator('input#password').fill('Demopass1!');
    await page.locator('input#confirmPassword').fill('Demopass1!');
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page.getByText("Please enter a valid email address")).toBeVisible();
  });

  test("shows error for password that doesn't meet complexity", async ({ page }) => {
    await page.locator('input#first_name').fill('John');
    await page.locator('input#last_name').fill('Doe');
    await page.locator('input#email').fill('user@example.com');

    // Too short password
    await page.locator('input#password').fill('short');
    await page.locator('input#confirmPassword').fill('short');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.getByText("Password must be at least 8 characters long")).toBeVisible();

    // Missing lowercase
    await page.locator('input#password').fill('PASSWORD1!');
    await page.locator('input#confirmPassword').fill('PASSWORD1!');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.getByText("Password must contain at least one lowercase letter")).toBeVisible();

    // Missing number
    await page.locator('input#password').fill('Password!');
    await page.locator('input#confirmPassword').fill('Password!');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.getByText("Password must contain at least one number")).toBeVisible();

    // Missing special character
    await page.locator('input#password').fill('Password123');
    await page.locator('input#confirmPassword').fill('Password123');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.getByText("Password must contain at least one special character")).toBeVisible();
  });

  test("shows error when passwords do not match", async ({ page }) => {
    await page.locator('input#first_name').fill('John');
    await page.locator('input#last_name').fill('Doe');
    await page.locator('input#email').fill('user@example.com');
    await page.locator('input#password').fill('Demopass1!');
    await page.locator('input#confirmPassword').fill('DifferentPass1!');
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page.getByText("Passwords don't match")).toBeVisible();
  });

  test("shows error when user already exists", async ({ page }) => {
    // Using existing user email in DB
    await page.locator('input#first_name').fill('John');
    await page.locator('input#last_name').fill('Doe');
    await page.locator('input#email').fill('admin@nextlaunchkit.com');
    await page.locator('input#password').fill('Demopass1!');
    await page.locator('input#confirmPassword').fill('Demopass1!');
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page.getByText("User already exists with this email")).toBeVisible();
  });
});

test("successful signup redirects with message", async ({ page }) => {
  await page.goto("/auth/signup");

  await page.locator('input#first_name').fill('ValidFirst');
  await page.locator('input#last_name').fill('ValidLast');
  await page.locator('input#email').fill(`user${Date.now()}@example.com`);
  await page.locator('input#password').fill('Demopass1!');
  await page.locator('input#confirmPassword').fill('Demopass1!');
  await page.getByRole('button', { name: /create account/i }).click();

  await expect(page).toHaveURL(/\/auth\/signin/);

  await expect(page.getByText(/account created successfully/i)).toBeVisible();
});
