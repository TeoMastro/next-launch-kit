'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

interface NavigationItem {
  title: string;
  href: string;
}

interface MobileNavigationProps {
  navigationItems: NavigationItem[];
}

export default function MobileNavigation({
  navigationItems,
}: MobileNavigationProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4">
          <Link
            href="/"
            className="flex items-center space-x-2 pb-4"
            onClick={() => setOpen(false)}
          ></Link>
          {navigationItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="block px-2 py-1 text-lg transition-colors hover:text-foreground/80"
              onClick={() => setOpen(false)}
            >
              {item.title}
            </Link>
          ))}
          <Button
            asChild
            className="bg-black text-white hover:bg-black/90 dark:bg-black dark:text-white dark:hover:bg-black/90 mx-5"
          >
            <Link href="/auth/signin">Demo</Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
