# Next.js Launch Kit

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and enhanced with PostgreSQL, Prisma, and Docker support.

## Tech Stack

- **Framework**: Next.js 15.3.2 with App Router
- **Styling**: TailwindCSS 4 with custom theme
- **Database**: PostgreSQL (latest)
- **ORM**: Prisma
- **Runtime**: Node.js 22.16
- **Container**: Docker & Docker Compose
- **TypeScript**: Full type safety

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
  id         String   @id @default(cuid())
  firstName  String
  lastName   String
  email      String   @unique
  role       Role     @default(USER)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
  MODERATOR
}
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://postgres:password123@localhost:5433/next_launch_kit"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Development
NODE_ENV="development"
```

## Project Structure

```
next-launch-kit/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Database seeding script
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── globals.css   # Global styles
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   └── lib/
│       ├── prisma.ts     # Prisma client instance
│       └── utils.ts      # Utility functions
├── public/               # Static assets
├── docker-compose.yml    # Docker services configuration
├── Dockerfile           # Docker image configuration
├── .env.example         # Environment variables template
└── package.json         # Dependencies and scripts
```

## Development Workflow

1. **Making database changes**:
   - Edit `prisma/schema.prisma`
   - Run `npm run db:migrate` to create and apply migration
   - Run `npm run db:generate` to update Prisma client

2. **Adding new features**:
   - Create your React components in `src/app/`
   - Use the Prisma client from `src/lib/prisma.ts`
   - Style with TailwindCSS classes

3. **Testing database changes**:
   - Use `npm run db:studio` to open Prisma Studio
   - View and edit data directly in the browser

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
   - Set strong passwords and secrets
   - Configure proper network security

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Prisma Documentation](https://www.prisma.io/docs) - learn about Prisma ORM
- [TailwindCSS Documentation](https://tailwindcss.com/docs) - learn about utility-first CSS
- [Docker Documentation](https://docs.docker.com/) - learn about containerization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.