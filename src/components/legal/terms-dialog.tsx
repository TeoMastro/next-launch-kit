'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FileText } from 'lucide-react';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TermsDialogProps {
  title: string;
  isInSidebar?: boolean;
}

export function TermsDialog({ title, isInSidebar = true }: TermsDialogProps) {
  const TriggerComponent = isInSidebar ? (
    <SidebarMenuButton
      size="sm"
      className="text-muted-foreground hover:text-foreground"
    >
      <FileText className="h-4 w-4" />
      <span className="text-xs">{title}</span>
    </SidebarMenuButton>
  ) : (
    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors underline">
      {title}
    </button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{TriggerComponent}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Terms and conditions for using our service
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold mb-2">Acceptance of Terms</h3>
              <p>
                By accessing and using this service, you accept and agree to be
                bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">Use License</h3>
              <p>
                Permission is granted to temporarily use our service for
                personal, non-commercial transitory viewing only.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">Disclaimer</h3>
              <p>
                The materials on our service are provided on an &apos;as
                is&apos; basis. We make no warranties, expressed or implied.
              </p>
            </section>

            {/* Add more sections as needed */}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
