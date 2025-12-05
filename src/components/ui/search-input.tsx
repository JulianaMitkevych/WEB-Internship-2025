'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils';

type TSearchInputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export function SearchInput({
  placeholder = 'Search',
  value = '',
  onChange,
  className = '',
}: TSearchInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  const styleWhenNotFocused: React.CSSProperties = {
    backgroundImage:
      'linear-gradient(94.99deg, #FCF9F2 -15.53%, #FFFDF6 132.51%), linear-gradient(181.78deg, #EEE5D2 0.25%, rgba(250, 247, 240, 0) 48.39%, rgba(235, 227, 208, 0.29) 98.49%)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    border: '1px solid transparent',
    boxShadow:
      '1px 1px 5px 0px #F2E8D3CC inset, -4px -4px 5px 0px #FFFEFC inset',
  };

  const styleWhenFocused: React.CSSProperties = {
    background: 'transparent',
    border: '1px solid',
    borderColor: 'var(--color-input-border)',
    boxShadow: 'none',
  };

  const computedStyle: React.CSSProperties = isFocused
    ? styleWhenFocused
    : styleWhenNotFocused;

  return (
    <div className={cn('relative w-full', className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-grey-x-dark" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          'w-full h-11 pl-10 pr-10 py-1',
          'file:text-foreground placeholder:text-grey-x-dark selection:text-bone selection:bg-blue-500',
          'text-base text-night-sky shadow-xs transition-all duration-200 ease-in-out outline-none',
          'rounded-sm border bg-transparent',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          'focus-visible:border-night-sky'
        )}
        style={computedStyle}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange?.('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-grey rounded-full transition-colors duration-200"
        >
          <X className="h-4 w-4 text-night-sky" />
        </button>
      )}
    </div>
  );
}
