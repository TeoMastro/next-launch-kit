## 🎭 Testing with Playwright

This project includes end-to-end testing with Playwright for comprehensive authentication and user flow testing.

### Prerequisites for Testing

Before running any tests, you need to create the authentication directory:

```bash
mkdir -p playwright/.auth
```

**Important**: The `playwright/.auth` directory stores sensitive authentication state (cookies, sessions) and should never be committed to version control.

### First-Time Test Database Setup

**1. Copy the example test environment file:**

```
cp .env.example .env.test
```

**2. Update `.env.test` with test database configuration:**

```
DATABASE_URL="postgresql://postgres:password123@localhost:5433/next_launch_kit_test"
AUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
NODE_ENV="test"
```

**3. Create the test database:**

1. Open pgAdmin at [http://localhost:5051](http://localhost:5051)
2. Connect to your PostgreSQL server (see pgAdmin setup above)
3. Right-click on "Databases" and select "Create" → "Database..."
4. Set **Database name**: `next_launch_kit_test`
5. Set **Owner**: `postgres`
6. Click "Save"

**4. Apply database schema to test database:**

```
npm run migrate:test:dev
```

### Available Test Commands

```bash
npx playwright test
```
