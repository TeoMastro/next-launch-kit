## 🎭 Testing with Playwright

This project includes end-to-end testing with Playwright for comprehensive authentication and user flow testing.

### First-Time Test Setup

**1. Create the authentication directory:**

```bash
mkdir -p playwright/.auth
```

**Important**: The `playwright/.auth` directory stores sensitive authentication state (cookies, sessions) and should never be committed to version control.

**2. Create the test database:**

Follow the same instructions as the main README file but instead set **Database name**: `next_launch_kit_test`

**3. Apply database schema to test database:**

```
npm run db:push:test
```

**4. Run the tests**

```bash
npx playwright test
```
