import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "html",

	use: {
		baseURL: "http://localhost:3000",
		trace: "on-first-retry",
	},

	projects: [
		// Setup project for authentication
		{ name: "setup", testMatch: /.*\.setup\.ts/ },

		{
			name: "chromium-auth",
			testMatch: ["**/user-create.spec.ts", "**/user-update.spec.ts", "**/user-view.spec.ts"],
			use: {
				...devices["Desktop Chrome"],
				storageState: "playwright/.auth/user.json",
			},
			dependencies: ["setup"],
		},

		{
			name: "chromium-unauth",
			testMatch: ["**/signin.spec.ts", "**/signup.spec.ts", "**/user-unauthorized-access.spec.ts"],
			use: {
				...devices["Desktop Chrome"],
				// No storageState - starts fresh
			},
			dependencies: ["setup"], // Still depends on setup to ensure auth file exists
		},
	],

	webServer: {
		command: "npm run dev",
		url: "http://localhost:3000",
		reuseExistingServer: !process.env.CI,
	},
});
