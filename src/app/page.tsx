import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Zap,
  Database,
  Layers,
  Palette,
  Shield,
  Sparkles,
  Users,
  UserCog,
  FileSpreadsheet,
  CheckCircle,
  TestTube,
  FileText,
  FileJson,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import MobileNavigation from '@/components/marketing/mobile-navigation';
import CopyButton from '@/components/marketing/copy-button';
import { PrivacyPolicyDialog } from '@/components/legal/privacy-policy-dialog';
import { TermsDialog } from '@/components/legal/terms-dialog';

export default function MarketingPage() {
  const navigationItems = [
    { title: 'Features', href: '#features' },
    { title: 'Technology', href: '#technology' },
    {
      title: 'Documentation',
      href: 'https://github.com/TeoMastro/next-launch-kit?tab=readme-ov-file#next-launch-kit',
      external: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Responsive Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                NL
              </span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              Next Launch Kit
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50'
                      )}
                    >
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <Button
                  asChild
                  className="bg-black text-white hover:bg-black/90 dark:bg-black dark:text-white dark:hover:bg-black/90"
                >
                  <Link href="/auth/signin">Demo</Link>
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Navigation */}
          <MobileNavigation navigationItems={navigationItems} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Next Launch Kit
                </span>
              </h1>

              <p className="mb-8 text-lg text-muted-foreground sm:text-xl md:text-2xl mx-auto max-w-2xl">
                An open source Next.js starter kit to launch your projects with
                ease
              </p>

              <div className="mb-12 space-y-4">
                <h3 className="text-lg font-semibold text-center">
                  Get Started
                </h3>
                <div className="mx-auto max-w-2xl">
                  <div className="relative">
                    <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                      <code className="text-sm text-foreground font-mono break-all">
                        git clone
                        https://github.com/TeoMastro/next-launch-kit.git
                      </code>
                      <CopyButton textToCopy="git clone https://github.com/TeoMastro/next-launch-kit.git" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsive YouTube Video */}
              <div className="mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-lg shadow-2xl">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/M8lhutHNJJQ"
                  title="Next Launch Kit Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="mx-auto max-w-6xl">
              <div className="mb-12 text-center md:mb-16">
                <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                  Features
                </h2>
                <p className="text-lg text-muted-foreground md:text-xl mx-auto max-w-2xl">
                  Everything you need to build production-ready applications out
                  of the box
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Authentication Pages */}
                <div className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all hover:shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        Complete Auth System
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Sign in, sign up, email verification, and password reset
                        pages ready to use
                      </p>
                    </div>
                  </div>
                </div>

                {/* RBAC */}
                <div className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all hover:shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                      <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        Role-Based Access Control
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        User and admin roles with proper access control
                        throughout the application
                      </p>
                    </div>
                  </div>
                </div>

                {/* User Management */}
                <div className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all hover:shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                      <UserCog className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        User CRUD Operations
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Complete user management system available for admin
                        users only
                      </p>
                    </div>
                  </div>
                </div>

                {/* Data Export */}
                <div className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all hover:shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
                      <FileSpreadsheet className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        Data Export Ready
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Export your data to CSV and Excel formats with built-in
                        functionality
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Validation */}
                <div className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all hover:shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                      <CheckCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        Zod Form Validation
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Type-safe form validation with Zod schemas for reliable
                        data handling
                      </p>
                    </div>
                  </div>
                </div>

                {/* Testing */}
                <div className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all hover:shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/20">
                      <TestTube className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        Playwright Testing
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        End-to-end testing setup with Playwright for reliable
                        application testing
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logging */}
                <div className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all hover:shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                      <FileText className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        Winston
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Professional logging system with Winston for debugging
                        and monitoring
                      </p>
                    </div>
                  </div>
                </div>

                {/* UI Components */}
                <div className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all hover:shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
                      <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        Consistent UI & Tables
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Beautiful, consistent interface with shadcn/ui
                        components and data tables
                      </p>
                    </div>
                  </div>
                </div>

                {/* UI Components */}
                <div className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all hover:shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
                      <FileJson className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        Side menu and responsive design
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Side menu that works out of the box with responsive
                        layout and a burger menu on mobile.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section id="technology" className="w-full bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="mx-auto max-w-6xl">
              <div className="mb-12 text-center md:mb-16">
                <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                  Technology
                </h2>
                <p className="text-lg text-muted-foreground md:text-xl mx-auto max-w-2xl">
                  Everything you need to build modern web applications
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
                {/* Next.js Card */}
                <Card className="w-full max-w-sm transition-shadow hover:shadow-lg">
                  <CardHeader className="text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white mx-auto">
                      <Zap className="h-6 w-6" />
                    </div>
                    <CardTitle>Next.js 15</CardTitle>
                    <CardDescription>
                      A React framework with the App Router
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      Built with the latest Next.js features including App
                      Router, Server Components, and optimized performance out
                      of the box.
                    </p>
                  </CardContent>
                </Card>

                {/* PostgreSQL Card */}
                <Card className="w-full max-w-sm transition-shadow hover:shadow-lg">
                  <CardHeader className="text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white mx-auto">
                      <Database className="h-6 w-6" />
                    </div>
                    <CardTitle>PostgreSQL</CardTitle>
                    <CardDescription>
                      Robust relational database
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      Production-ready PostgreSQL setup with optimized queries,
                      indexing, and built-in backup strategies.
                    </p>
                  </CardContent>
                </Card>

                {/* Prisma Card */}
                <Card className="w-full max-w-sm transition-shadow hover:shadow-lg">
                  <CardHeader className="text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 text-white mx-auto">
                      <Layers className="h-6 w-6" />
                    </div>
                    <CardTitle>Prisma ORM</CardTitle>
                    <CardDescription>Type-safe database client</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      Modern database toolkit with type safety, migrations, and
                      an intuitive data model for rapid development.
                    </p>
                  </CardContent>
                </Card>

                {/* shadcn/ui Card */}
                <Card className="w-full max-w-sm transition-shadow hover:shadow-lg">
                  <CardHeader className="text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900 text-white mx-auto">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <CardTitle>shadcn/ui</CardTitle>
                    <CardDescription>Beautiful UI components</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      Beautifully designed components built with Radix UI and
                      Tailwind CSS. Copy, paste, and customize to your needs.
                    </p>
                  </CardContent>
                </Card>

                {/* NextAuth Card */}
                <Card className="w-full max-w-sm transition-shadow hover:shadow-lg">
                  <CardHeader className="text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white mx-auto">
                      <Shield className="h-6 w-6" />
                    </div>
                    <CardTitle>Auth.js</CardTitle>
                    <CardDescription>
                      Complete authentication solution
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      Secure authentication with support for OAuth providers,
                      email/password, and custom authentication flows.
                    </p>
                  </CardContent>
                </Card>

                {/* Tailwind CSS Card */}
                <Card className="w-full max-w-sm transition-shadow hover:shadow-lg">
                  <CardHeader className="text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500 text-white mx-auto">
                      <Palette className="h-6 w-6" />
                    </div>
                    <CardTitle>Tailwind CSS</CardTitle>
                    <CardDescription>
                      Utility-first CSS framework
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">
                      Rapidly build custom designs with utility classes.
                      Pre-configured with dark mode and responsive breakpoints.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Responsive Footer */}
      <footer className="w-full border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Next Launch Kit. All rights
                reserved.
              </p>
              {/* Legal Links */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                <PrivacyPolicyDialog
                  title="Privacy Policy"
                  isInSidebar={false}
                />
                <TermsDialog title="Terms of Service" isInSidebar={false} />
              </div>
            </div>

            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="https://github.com/TeoMastro/next-launch-kit?tab=readme-ov-file#next-launch-kit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>

              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="https://www.youtube.com/watch?v=M8lhutHNJJQ&list=PLT4KPYqv8UrGTuV6mtQqRbHPAxGdSmd7X"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className="h-4 w-4" />
                  <span className="sr-only">YouTube</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
