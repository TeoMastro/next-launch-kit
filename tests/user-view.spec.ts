import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

test.use({ storageState: "playwright/.auth/admin.json" });

test("can view user details page", async ({ page }) => {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: "postgresql://postgres:password123@localhost:5433/next_launch_kit_test",
            },
        },
    });

    const uniqueEmail = `testuser${Date.now()}@example.com`;
    const hashedPassword = await bcrypt.hash('testpass123', 10);
    
    const testUser = await prisma.user.create({
        data: {
            first_name: "Test",
            last_name: "User",
            email: uniqueEmail,
            password: hashedPassword,
            role: "USER"
        }
    });

    await prisma.$disconnect();

    await page.goto(`/admin/user/${testUser.id}`);
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Test User")).toBeVisible();
    await expect(page.getByText(uniqueEmail)).toBeVisible();
    await expect(page.getByText(`#${testUser.id}`)).toBeVisible();
    await expect(page.getByText("Active")).toBeVisible();
});
