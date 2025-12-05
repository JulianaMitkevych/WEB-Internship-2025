'use client';

import { ChangeEvent, ComponentProps, forwardRef } from 'react';
import { cn } from '@/utils';
import { Input } from './input';

export interface PhoneInputProps
  extends Omit<ComponentProps<'input'>, 'onChange'> {
  countryCode?: string;
  onChange?: (value: string) => void;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, countryCode, onChange, ...props }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const cleanValue = e.target.value.replace(/[^\d]/g, '');
      onChange?.(cleanValue);
    };

    return (
      <div className="relative">
        {countryCode && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-grey-x-dark font-normal pointer-events-none z-10">
            {countryCode}
          </div>
        )}
        <Input
          className={cn(countryCode && 'pl-16', className)}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
