'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Shield } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarMenuButton } from '@/components/ui/sidebar';

interface PrivacyPolicyDialogProps {
  title: string;
  isInSidebar?: boolean;
}

export function PrivacyPolicyDialog({
  title,
  isInSidebar = true,
}: PrivacyPolicyDialogProps) {
  const TriggerComponent = isInSidebar ? (
    <SidebarMenuButton
      size="sm"
      className="text-muted-foreground hover:text-foreground"
    >
      <Shield className="h-4 w-4" />
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
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>
            How we collect, use, and protect your information
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold mb-2">Information We Collect</h3>
              <p>
                We collect information you provide directly to us, such as when
                you create an account, use our services, or contact us for
                support.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">
                How We Use Your Information
              </h3>
              <p>
                We use the information we collect to provide, maintain, and
                improve our services, process transactions, and communicate with
                you.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">Information Sharing</h3>
              <p>
                We do not sell, trade, or otherwise transfer your personal
                information to third parties without your consent, except as
                described in this policy.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
