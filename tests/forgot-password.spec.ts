import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const dbUrl =
	"postgresql://postgres:password123@localhost:5433/next_launch_kit_test";

async function createUser(email: string) {
	const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });
	const user = await prisma.user.create({
		data: {
			first_name: "Test",
			last_name: "Forgot",
			email,
			password: await bcrypt.hash("testpass123", 10),
			status: "ACTIVE",
		},
	});
	await prisma.$disconnect();
	return user;
}

test("forgot password requests handle exist and non-exist", async ({
	page,
}) => {
	// Existing user
	const email = `forgot${Date.now()}@example.com`;
	await createUser(email);

	await page.goto("/auth/forgot-password");
	await page.waitForLoadState("networkidle");
	// Submit form for user that exists
	await page.getByLabel(/email/i).fill(email);
	await page.getByRole("button", { name: /send reset link/i }).click();
	await expect(
		page.getByText(/If an account with that email exists/i)
	).toBeVisible();

	// Also submit for non-existent user (should NOT error, per your spec)
	const badEmail = `notfound${Date.now()}@example.com`;
	await page.goto("/auth/forgot-password");
	await page.getByLabel(/email/i).fill(badEmail);
	await page.getByRole("button", { name: /send reset link/i }).click();
	await expect(
		page.getByText(/If an account with that email exists/i)
	).toBeVisible();
});
