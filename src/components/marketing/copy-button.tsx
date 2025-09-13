'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Github, Check } from 'lucide-react';

interface CopyButtonProps {
  textToCopy: string;
}

export default function CopyButton({ textToCopy }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="ml-2 flex-shrink-0"
    >
      {isCopied ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Github className="mr-2 h-4 w-4" />
          Copy
        </>
      )}
    </Button>
  );
}
