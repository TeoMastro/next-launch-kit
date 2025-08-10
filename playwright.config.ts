import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "html",

	globalSetup: require.resolve("./tests/global-setup.ts"),

	use: {
		baseURL: "http://localhost:3000",
		trace: "on-first-retry",
	},

	projects: [
		{ name: "setup", testMatch: /.*\.setup\.ts/ },

		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
			},
			dependencies: ["setup"],
		},
	],

	webServer: {
		command: "npm run dev",
		url: "http://localhost:3000",
		reuseExistingServer: !process.env.CI,
		env: {
			DATABASE_URL:
				"postgresql://postgres:password123@localhost:5433/next_launch_kit_test",
			NODE_ENV: "test",
		},
	},
});
