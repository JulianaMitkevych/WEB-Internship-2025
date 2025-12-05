'use client';

import React from 'react';
import { cn } from '@/utils';

type RadioButtonProps = {
  value: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: string) => void;
  className?: string;
};

export function RadioButton({
  value,
  label,
  description,
  checked,
  onChange,
  className,
}: RadioButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={cn('text-left transition-all hover:opacity-80', className)}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'inline-flex min-h-5 min-w-5 rounded-full border border-grey-xxx-dark items-center justify-center shadow-md/30',
            checked && 'border-rock bg-rock'
          )}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-bone" />
        </span>
        <div>
          <div className="text-night-sky text-base font-medium">{label}</div>
          {!!description && (
            <div className="text-grey-x-dark text-sm font-normal">
              {description}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
