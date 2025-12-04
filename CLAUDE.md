# Next Launch Kit - Project Guide

This is a Next.js 15 full-stack application with authentication, user management, and internationalization.

## Tech Stack

- **Framework**: Next.js 15 with App Router, React 19, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 (credentials + Google OAuth)
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Validation**: Zod schemas
- **Email**: Nodemailer (SMTP)
- **Logging**: Winston
- **Testing**: Playwright
- **i18n**: next-intl (English/Greek)

## Key Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with demo users
- `npx playwright test` - Run end-to-end tests

## Project Structure

- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - React components (UI, forms, layouts)
- `/src/server-actions` - Server actions for data mutations
- `/src/lib` - Utilities (auth, validation, logging, prisma)
- `/src/types` - TypeScript type definitions
- `/prisma` - Database schema and migrations
- `/messages` - i18n translation files (en.json, el.json)
- `/tests` - Playwright E2E tests

## Code Standards

- Use TypeScript with strict mode enabled
- Server Components by default; add `'use client'` only when necessary
- Server actions in `/src/server-actions` for mutations
- All forms use `useActionState` hook for form state management
- Zod schemas in `/src/lib/validation-schemas.ts` for validation
- Error messages as translation keys, translated via next-intl
- Prisma for all database operations via `/src/lib/prisma.ts`
- Logger for server-side logging via `/src/lib/logger.ts`

## Authentication & Authorization

- NextAuth.js configuration in `/src/lib/auth.ts`
- Middleware in `/src/proxy.ts` protects routes
- User roles: `USER`, `ADMIN` (Prisma enum)
- User status: `ACTIVE`, `INACTIVE`, `UNVERIFIED` (Prisma enum)
- Admin routes: `/admin/*` - only accessible to ADMIN role
- Protected routes: `/dashboard`, `/profile`, `/settings` - require authentication

## Form Patterns

All forms follow this pattern:

```typescript
// Define state type
type FormState = {
  success: boolean;
  errors: Record<string, string[]>;
  formData: {
    /* form fields */
  };
  globalError: string | null;
};

// Use useActionState hook
const [state, formAction] = useActionState(serverAction, initialState);

// Server action validates with Zod, returns FormState
// Translation keys used for error messages
```

## Database

- Connection via Prisma Client (`/src/lib/prisma.ts`)
- Main models: `User`, `Account`
- Always use transactions for multi-step operations
- Use `revalidatePath()` after mutations that affect UI

## Translation System

- Locale stored in cookies
- Translation files: `/messages/en.json`, `/messages/el.json`
- Server: `getTranslations('namespace')` from `next-intl/server`
- Client: `useTranslations('namespace')` from `next-intl`
- All user-facing strings must use translation keys

## Component Conventions

- shadcn/ui components in `/src/components/ui`
- Use existing UI components, don't create custom ones
- InfoAlert component for success/error/warning messages
- All admin tables use sortable headers, pagination, filters

## Server Actions

- Located in `/src/server-actions`
- Always validate with Zod schemas
- Return FormState objects for forms
- Use `redirect()` for successful mutations
- Log important actions with Winston logger
- Check admin authorization with `checkAdminAuth()` helper

## Environment Variables

Required in `.env` (see `.env.example`):

- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_URL` - Application URL
- `AUTH_SECRET` - NextAuth secret
- `SMTP_*` - Email configuration
- `AUTH_GOOGLE_*` - Google OAuth (optional)

## Testing

- Playwright tests in `/tests` directory
- Test database: `next_launch_kit_test`
- Setup in `tests/global-setup.ts` creates test users
- Auth state stored in `playwright/.auth/*.json`
- Run `npm run db:push:test` to sync test database schema

## Important Notes

- Never commit `.env` files or `playwright/.auth` directory
- Password fields cleared after form submission errors
- Demo users: admin@nextlaunchkit.com / user@nextlaunchkit.com
- Email verification required for new signups
- Password reset tokens expire in 24 hours
- User deletion prevented for own account (admin)
- Prettier config: single quotes, 2 spaces, trailing commas

## File Creation

When creating new files:

- Use existing patterns from similar files
- Place server actions in `/src/server-actions`
- Place types in `/src/types`
- Follow existing naming conventions (kebab-case for files)
- Add translation keys to both `/messages/en.json` and `/messages/el.json`
