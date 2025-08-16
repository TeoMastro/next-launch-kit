import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

test.use({ storageState: "playwright/.auth/admin.json" });

const dbUrl =
	"postgresql://postgres:password123@localhost:5433/next_launch_kit_test";

test("shows admin and user accounts in the users table", async ({ page }) => {
	await page.goto("/admin/user");
	await page.waitForLoadState("networkidle");

	await expect(
		page.locator("td").filter({ hasText: "admin@nextlaunchkit.com" })
	).toBeVisible();
	await expect(
		page.locator("td").filter({ hasText: "user@nextlaunchkit.com" })
	).toBeVisible();

	await expect(
		page.locator("td").filter({ hasText: "Admin User" })
	).toBeVisible();
	await expect(
		page.locator("td").filter({ hasText: "Demo User" })
	).toBeVisible();
});

test("can delete a user from the users table", async ({ page }) => {
	const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });
	const uniqueEmail = `delete${Date.now()}@example.com`;
	const hashedPassword = await bcrypt.hash("deletepass123", 10);
	await prisma.user.create({
		data: {
			first_name: "Delete",
			last_name: "Me",
			email: uniqueEmail,
			password: hashedPassword,
			role: "USER",
			status: "ACTIVE",
		},
	});
	await prisma.$disconnect();

	await page.goto("/admin/user");
	await page.waitForLoadState("networkidle");

	await expect(
		page.locator("td").filter({ hasText: uniqueEmail })
	).toBeVisible();

	const row = page.locator("tr", {
		has: page.locator(`td:has-text("${uniqueEmail}")`),
	});
	await row.locator("button").last().click();

	await page.getByRole("button", { name: /delete/i }).click();

	await expect(
		page.locator("td").filter({ hasText: uniqueEmail })
	).not.toBeVisible();
});
