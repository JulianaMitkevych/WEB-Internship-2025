
import * as React from 'react';
import { cn } from '../../utils';
import { CSSProperties } from 'react';

const GREEN_ACCENT = '#2F9E44';
const RED_ACCENT = '#EB5757';

function Input({
  className,
  type,
  onFocus,
  onBlur,
  isDark,
  ...props
}: React.ComponentProps<'input'> & { isDark?: boolean }) {
  const [isFocused, setIsFocused] = React.useState(false);

  // check error
  const isInvalid =
    props['aria-invalid'] === true || props['aria-invalid'] === 'true';

  const styleWhenNotInvalidAndNotFocused: CSSProperties = {
    backgroundColor: isDark ? '#2E2E2E' : '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '0.75rem',
  };

  const styleWhenFocusedAndNotInvalid: CSSProperties = {
    backgroundColor: isDark ? '#2E2E2E' : '#FFFFFF',
    border: `1px solid ${GREEN_ACCENT}`,
    borderRadius: '0.75rem',
  };

  const styleWhenInvalid: CSSProperties = {
    backgroundColor: isDark ? '#2E2E2E' : '#FFFFFF',
    border: `1px solid ${RED_ACCENT}`,
    borderRadius: '0.75rem',
  };

  const computedStyle = isInvalid
    ? styleWhenInvalid
    : isFocused
      ? styleWhenFocusedAndNotInvalid
      : styleWhenNotInvalidAndNotFocused;

  return (
    <input
      type={type}
      className={cn(
        'file:text-foreground placeholder:text-grey-x-dark flex h-12 w-full min-w-0 px-3 py-1 text-base text-night-sky transition-all duration-200 outline-none disabled:opacity-50',
        className
      )}
      style={computedStyle}
      onFocus={(e) => {
        setIsFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        onBlur?.(e);
      }}
      {...props}
    />
  );
}

export { Input };