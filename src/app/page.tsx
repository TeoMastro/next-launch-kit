'use client';

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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import MobileNavigation from '@/components/marketing/mobile-navigation';

export default function MarketingPage() {
  const navigationItems = [
    { title: 'Features', href: '#features' },
    { title: 'Documentation', href: '#docs' },
    { title: 'Pricing', href: '#pricing' },
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
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Next Launch Kit
                </span>
              </h1>

              <p className="mb-8 text-lg text-muted-foreground sm:text-xl md:text-2xl mx-auto max-w-2xl">
                An open source Next.js starter kit to launch your projects
                faster
              </p>

              <div className="mb-12 flex justify-center">
                <Button asChild size="lg">
                  <Link
                    href="https://github.com/yourusername/next-launch-kit"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-5 w-5" />
                    View Code on GitHub
                  </Link>
                </Button>
              </div>

              {/* Responsive YouTube Video */}
              <div className="mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-lg shadow-2xl">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
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
        <section id="features" className="w-full bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="mx-auto max-w-6xl">
              <div className="mb-12 text-center md:mb-16">
                <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                  Features
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
                      React framework with App Router
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
                    <CardTitle>NextAuth.js</CardTitle>
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
                © 2025 Next Launch Kit. All rights reserved.
              </p>
            </div>

            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="https://twitter.com/nextlaunchkit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>

              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="https://github.com/yourusername/next-launch-kit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>

              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="https://linkedin.com/company/nextlaunchkit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </Button>

              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="https://youtube.com/@nextlaunchkit"
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
