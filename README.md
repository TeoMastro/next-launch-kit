# Next Launch Kit

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and enhanced with PostgreSQL, Prisma, auth.js, and Docker support.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/docs) with the App Router
- **Authentication**: [NextAuth.js](https://next-auth.js.org) with credentials and Google provider
- **Styling/UI**: [TailwindCSS](https://tailwindcss.com/docs) with [shadcn/ui](https://ui.shadcn.com/docs) components
- **Database**: [PostgreSQL](https://www.postgresql.org/docs/)
- **ORM**: [Prisma](https://www.prisma.io/docs)
- **Validation**: [Zod](https://zod.dev)
- **Logs**: [Winston](https://github.com/winstonjs/winston#documentation)
- **Environment**: [Docker](https://docs.docker.com) & [Docker Compose](https://docs.docker.com/compose/)
- **TypeScript**: [TypeScript](https://www.typescriptlang.org/docs/)
- **Tests**: [Playwright](https://playwright.dev/docs/)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- v20.10.0 of [Node.js](https://nodejs.org/) (if running locally)
- [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) if you want to manage node versions by yourself.

## Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/TeoMastro/next-launch-kit.git
   cd next-launch-kit
   ```

2. **Create environment file**

   ```bash
   cp .env.example .env
   ```

3. **Start the application with Docker**

   ```bash
   # Start PostgreSQL and the app
   docker-compose up -d

   # Run database migrations
   npx prisma db push

   # Seed the database (optional)
   npm run db:seed
   ```

4. **Make sure to [register your database](https://github.com/TeoMastro/next-launch-kit?tab=readme-ov-file#registering-the-postgresql-server) on pg admin before continuing to step 5**

5. **To run in dev mode**

   ```bash
   npm run dev
   ```

   Navigate to [http://localhost:3000/dashboard](http://localhost:3000/dashboard) and login with the admin user to see the application.

## pgAdmin Server Registration

After starting the containers with `docker-compose up -d`, pgAdmin won't automatically discover your PostgreSQL database. You need to manually register the server connection.

### Accessing pgAdmin

1. **Open pgAdmin** in your browser at [http://localhost:5051](http://localhost:5051)
2. **Log in** with the credentials:
   - Email: `admin@nextlaunchkit.com`
   - Password: `nextlaunchkit123`

### Registering the PostgreSQL Server

Once logged into pgAdmin, follow these steps to connect to your PostgreSQL database:

1. **Right-click on "Servers"** in the left sidebar
2. **Select "Register" > "Server..."** from the context menu
3. **Fill in the General tab:**
   - **Name**: `Next Launch Kit DB` (or any name you prefer)
   - **Server group**: Leave as "Servers"
   - **Comments**: Optional description

4. **Switch to the Connection tab** and enter:
   - **Host name/address**: `postgres` (use the container name, not `localhost`)
   - **Port**: `5432`
   - **Maintenance database**: `next_launch_kit`
   - **Username**: `postgres`
   - **Password**: `password123`

5. **Click "Save"** to register the server

## Demo Accounts

After running the seed script, you can log in with these demo accounts:

- **Admin User**:
  - Email: `admin@nextlaunchkit.com`
  - Password: `demoadmin!1`
  - Role: ADMIN

- **Regular User**:
  - Email: `user@nextlaunchkit.com`
  - Password: `demouser!1`
  - Role: USER

## package.json scripts

```bash
# Generate Prisma client
npm run db:generate

# Create and apply a new migration
npm run db:migrate

# Push schema changes without creating migration files
npm run db:push

# Reset the database (⚠️ This will delete all data)
npm run db:reset

# Seed the database with sample data
npm run db:seed

# Open Prisma Studio (Database GUI)
npm run db:studio

# Deploy migrations to test database
npm run migrate:test

# Reset test database
npm run migrate:test:reset

# Create and apply migration to test database
npm run migrate:test:dev

# Push schema changes to test database
npm run db:push:test

# Format all files
npm run format

# Check formatting without making changes
npm run format:check
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
