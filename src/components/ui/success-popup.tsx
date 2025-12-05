'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/utils';
import { Check } from 'lucide-react';

type SuccessPopupProps = {
  title: string;
  subtitle?: string;
  open: boolean;
  onClose: () => void;
  className?: string;
};

export function SuccessPopup({
  title,
  subtitle,
  open,
  onClose,
  className,
}: SuccessPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          'flex flex-col items-center justify-center gap-6 py-10 px-15 text-center bg-bone rounded-[22px] shadow-lg max-w-sm',
          className
        )}
      >
        <DialogHeader className="text-night-sky gap-2">
          <DialogTitle className="text-xl font-medium m-0 text-center">
            {title}
          </DialogTitle>
          {subtitle && (
            <DialogDescription className="text-lg font-normal text-center">
              {subtitle}
            </DialogDescription>
          )}
        </DialogHeader>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-[#81B558] hover:bg-[#6FA048] transition-colors"
          aria-label="Close"
        >
          <Check className="h-6 w-6 text-white" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
