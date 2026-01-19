'use client';

import React, { ReactNode, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAnimationTimeout } from '@/hooks';

type TProps = {
  // Centralized mode props
  isOpen?: boolean;
  onClose?: () => void;

  // Trigger mode props
  children?: ReactNode;

  // Common props
  onConfirm: () => void;

  // i18n-first props (preferred)
  titleKey?: string;
  titleValues?: Record<string, unknown>;
  descriptionKey?: string;
  descriptionValues?: Record<string, unknown>;
  confirmKey: string;

  // fallback plain strings (back-compat)
  title?: string;
  description?: string;
  confirmButtonText?: string;

  isLoading?: boolean;
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  children,
  onConfirm,
  titleKey,
  titleValues,
  descriptionKey,
  descriptionValues,
  confirmKey,
  isLoading = false,
}: TProps) {
  const { t } = useTranslation();

  // Determine if we're in centralized or trigger mode
  const isCentralizedMode = isOpen !== undefined && onClose !== undefined;
  const isTriggerMode = children !== undefined;

  // For trigger mode, manage internal state
  const [internalOpen, setInternalOpen] = useState(false);

  // Use external state for centralized mode, internal for trigger mode
  const modalOpen = isCentralizedMode ? isOpen : internalOpen;
  const handleClose = isCentralizedMode
    ? onClose
    : () => setInternalOpen(false);

  // Compute Dialog props based on mode so Trigger can control it
  const dialogProps = isCentralizedMode
    ? { open: modalOpen, onOpenChange: handleClose }
    : ({ open: internalOpen, onOpenChange: setInternalOpen } as const);

  const { isVisible } = useAnimationTimeout({
    isElementOpen: modalOpen,
  });

  const handleConfirm = async () => {
    try {
      await onConfirm();
      if (isTriggerMode) {
        setInternalOpen(false);
      }

      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog {...(dialogProps as any)}>
      {isTriggerMode && <DialogTrigger asChild>{children}</DialogTrigger>}
      {isVisible && (
        <DialogContent className="max-w-[544px] bg-[linear-gradient(170.84deg,_#FFFDF7_0%,_#FCF9F2_56.32%)] rounded-[22px] py-10 px-15 gap-6">
          <DialogHeader className="max-w-[344px] m-auto gap-6">
            <DialogTitle className="m-0 font-medium text-2xl text-black">
              <Trans
                i18nKey={titleKey}
                values={titleValues}
                components={{
                  b: <b className="text-blue-500 font-medium" />,
                  strong: <strong className="font-semibold" />,
                  em: <em className="italic" />,
                }}
              />
            </DialogTitle>
            <DialogDescription className="text-center text-base font-normal text-black">
              <Trans
                i18nKey={descriptionKey}
                values={descriptionValues}
                components={{
                  b: <b className="text-blue-500 font-medium" />,
                  strong: <strong className="font-semibold" />,
                  em: <em className="italic" />,
                }}
              />
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 max-w-[344px] m-auto w-full pt-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="cursor-pointer h-12 flex-1 rounded-lg font-medium text-base text-night-sky bg-sand hover:bg-sand/90 transition-all disabled:cursor-not-allowed"
            >
              {t('common.cancel')}
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="cursor-pointer h-12 flex-1 rounded-lg font-medium text-base text-white bg-night-sky transition-all hover:bg-night-sky/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('common.loading') : t(confirmKey)}
            </button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
