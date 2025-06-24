# Next.js Launch Kit

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and enhanced with PostgreSQL, Prisma, NextAuth.js authentication, and Docker support.

## Tech Stack

- **Framework**: Next.js 15.3.2 with App Router
- **Authentication**: NextAuth.js with credentials provider
- **Styling**: TailwindCSS with shadcn/ui components
- **Database**: PostgreSQL (latest)
- **ORM**: Prisma
- **Runtime**: Node.js 22.16
- **Container**: Docker & Docker Compose
- **TypeScript**: Full type safety

## Features

- 🔐 **Authentication System**: Email/password login with NextAuth.js
- 👥 **User Management**: Role-based access control (USER/ADMIN)
- 🎨 **Modern UI**: shadcn/ui components with TailwindCSS
- 🗄️ **Database**: PostgreSQL with Prisma ORM
- 🔒 **Security**: Password hashing with bcrypt, JWT sessions
- 🛡️ **Route Protection**: Middleware-based authentication
- 📱 **Responsive**: Mobile-first design

## Prerequisites

Before you begin, ensure you have the following installed:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js 22.16+](https://nodejs.org/) (if running locally)
- [npm](https://www.npmjs.com/) or your preferred package manager

## Quick Start

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
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
   docker-compose exec app npx prisma migrate dev
   
   # Seed the database (optional)
   docker-compose exec app npm run db:seed
   ```

4. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001) to see the application.
   
   **PgAdmin** (optional): Navigate to [http://localhost:5051](http://localhost:5051) to manage the database.
   - Email: `admin@nextlaunchkit.com`
   - Password: `nextlaunchkit123`

### Option 2: Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start PostgreSQL with Docker**
   ```bash
   docker-compose up postgres -d
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed the database (optional)
   npm run db:seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Authentication

The application includes a complete authentication system:

### Demo Accounts

After running the seed script, you can log in with these demo accounts:

- **Admin User**: 
  - Email: `admin@nextlaunchkit.com`
  - Password: `demoadmin!1`
  - Role: ADMIN

- **Regular User**:
  - Email: `user@nextlaunchkit.com` 
  - Password: `demouser!1`
  - Role: USER

### Features

- **Sign Up**: Create new accounts with email/password
- **Sign In**: Authenticate with existing credentials
- **Dashboard**: Protected route showing user information
- **Role-based Access**: Different permissions for USER/ADMIN roles
- **Middleware Protection**: Automatic route protection
- **Session Management**: Secure JWT-based sessions

## Database Management

### Prisma Commands

```bash
# Generate Prisma client
npm run db:generate

# Create and apply a new migration
npm run db:migrate

# Push schema changes without creating migration files
npm run db:push

# Reset the database (⚠️ This will delete all data)
npm run db:reset

# Open Prisma Studio (Database GUI)
npm run db:studio

# Seed the database with sample data
npm run db:seed
```

### Docker Database Commands

```bash
# Start only the PostgreSQL container
docker-compose up postgres -d

# View logs
docker-compose logs postgres

# Connect to PostgreSQL directly
docker-compose exec postgres psql -U postgres -d next_launch_kit

# Stop all containers
docker-compose down

# Stop and remove volumes (⚠️ This will delete all data)
docker-compose down -v
```

## Database Schema

The project includes a `User` model with the following structure:

```prisma
model User {
  id         Int      @id @default(autoincrement())
  first_name String
  last_name  String
  email      String   @unique
  password   String
  role       Role     @default(USER)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  @@map("users")
}

enum Role {
  USER
  ADMIN
}
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://postgres:password123@localhost:5433/next_launch_kit"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-make-it-long-and-random"

# Development
NODE_ENV="development"
```

## Development Workflow

1. **Making database changes**:
   - Edit `prisma/schema.prisma`
   - Run `npm run db:migrate` to create and apply migration
   - Run `npm run db:generate` to update Prisma client

2. **Adding new features**:
   - Create your React components in `src/components/`
   - Add new pages in `src/app/`
   - Use the Prisma client from `src/lib/prisma.ts`
   - Style with TailwindCSS and shadcn/ui components

3. **Testing authentication**:
   - Use the demo accounts to test login functionality
   - Test route protection by accessing `/dashboard`
   - Use `npm run db:studio` to view user data

4. **Adding protected routes**:
   - Update `middleware.ts` to include new protected paths
   - Use `getAuthSession()` in server components
   - Use `useSession()` in client components

## Production Deployment

The application is containerized and ready for production deployment:

1. **Build the Docker image**:
   ```bash
   docker build -t next-launch-kit .
   ```

2. **Run with docker-compose**:
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

3. **Environment considerations**:
   - Update `DATABASE_URL` for your production database
   - Set a strong `NEXTAUTH_SECRET` (minimum 32 characters)
   - Update `NEXTAUTH_URL` to your production domain
   - Configure proper network security
   - Set strong database passwords

## ⚙️ Environment Considerations

- ✅ Update `DATABASE_URL` for your production database
- ✅ Set a strong `NEXTAUTH_SECRET` (minimum 32 characters)
- ✅ Update `NEXTAUTH_URL` to your production domain
- ✅ Configure proper network security
- ✅ Set strong database passwords
- ✅ Enable SSL/TLS for database connections
- ✅ Set up proper backup strategies


## 🛠️ Troubleshooting

### Common Issues

**ESLint errors during build:**

```bash
# Check your eslint.config.mjs for proper configuration
# Disable problematic rules or fix unused variables
```

**Missing dependencies:**

```bash
# Always rebuild after adding packages
docker-compose up -d --build
```

**Database connection issues:**

```bash
# Check if PostgreSQL container is running
docker-compose ps

# Restart database container
docker-compose restart postgres
```

**Port conflicts:**

```bash
# Check if ports are already in use
# Modify ports in docker-compose.yml if needed
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [NextAuth.js Documentation](https://next-auth.js.org/) - learn about authentication
- [Prisma Documentation](https://www.prisma.io/docs) - learn about Prisma ORM
- [TailwindCSS Documentation](https://tailwindcss.com/docs) - learn about utility-first CSS
- [shadcn/ui Documentation](https://ui.shadcn.com/) - learn about the component library
- [Docker Documentation](https://docs.docker.com/) - learn about containerization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.