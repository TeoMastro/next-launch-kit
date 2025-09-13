## 🎭 Testing with Playwright

This project includes end-to-end testing with Playwright for comprehensive authentication and user flow testing.

**Important**: The `playwright/.auth` directory stores sensitive authentication state (cookies, sessions) and should never be committed to version control.

### First-Time Test Setup

**1. Create the authentication directory:**

```bash
mkdir -p playwright/.auth
```

**Important**: The `playwright/.auth` directory stores sensitive authentication state (cookies, sessions) and should never be committed to version control.

**2. Create the test database:**

1. Open pgAdmin at [http://localhost:5051](http://localhost:5051)
2. Connect to your PostgreSQL server (see pgAdmin setup above)
3. Right-click on "Databases" and select "Create" → "Database..."
4. Set **Database name**: `next_launch_kit_test`
5. Set **Owner**: `postgres`
6. Click "Save"

**3. Apply database schema to test database:**

```
npm run db:push:test
```

**4. Install locally**
Make sure you have a node version installed locally and run:

```
npm i
```

The test suite is running on the local webServer - not the one running on Docker (at least for now)

**5. Run the tests**

```bash
npx playwright test
```
