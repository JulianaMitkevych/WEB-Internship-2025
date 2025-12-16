// import * as React from 'react';
// import { cn } from '../../utils';
// import { CSSProperties } from 'react';

// const GREEN_ACCENT = '#2F9E44';

// function Input({
//   className,
//   type,
//   onFocus,
//   onBlur,
//   ...props
// }: React.ComponentProps<'input'>) {
//   const [isFocused, setIsFocused] = React.useState(false);
//   const isAriaInvalid =
//     props['aria-invalid'] === true || props['aria-invalid'] === 'true';

//   const styleWhenNotInvalidAndNotFocused: CSSProperties = {
//     backgroundColor: '#FFFFFF',
//     border: '1px solid #E5E7EB',
//     borderRadius: '0.75rem',
//     boxShadow: 'none',
//   };

//   const styleWhenFocusedAndNotInvalid: React.CSSProperties = {
//     backgroundColor: '#FFFFFF',
//     border: `1px solid ${GREEN_ACCENT}`,
//     borderColor: GREEN_ACCENT,
//     boxShadow: 'none',
//     borderRadius: '0.75rem',
//   };

//   const computedStyle: React.CSSProperties | undefined = isAriaInvalid
//     ? undefined
//     : isFocused
//       ? styleWhenFocusedAndNotInvalid
//       : styleWhenNotInvalidAndNotFocused;

//   return (
//     <input
//       type={type}
//       data-slot="input"
//       className={cn(
//         'file:text-foreground placeholder:text-grey-x-dark selection:text-bone selection:bg-blue-500 flex h-12 w-full min-w-0 rounded-xl bg-transparent px-3 py-1 text-base text-night-sky shadow-xs transition-all duration-200 ease-in-out outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-base file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base',
//         'aria-invalid:border-destructive aria-invalid:shadow-none dark:aria-invalid:border-destructive',
//         'aria-invalid:focus-visible:border-destructive',
//         className
//       )}
//       style={computedStyle}
//       onFocus={(e) => {
//         setIsFocused(true);
//         onFocus?.(e);
//       }}
//       onBlur={(e) => {
//         setIsFocused(false);
//         onBlur?.(e);
//       }}
//       {...props}
//     />
//   );
// }

// export { Input };

import * as React from 'react';
import { cn } from '../../utils';
import { CSSProperties } from 'react';

const GREEN_ACCENT = '#2F9E44';
const RED_ACCENT = '#EF4444';

function Input({
  className,
  type,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<'input'>) {
  const [isFocused, setIsFocused] = React.useState(false);
  const isAriaInvalid =
    props['aria-invalid'] === true || props['aria-invalid'] === 'true';

  const styleWhenNotInvalidAndNotFocused: CSSProperties = {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '0.75rem',
    boxShadow: 'none',
  };

  const styleWhenFocusedAndNotInvalid: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    border: `1px solid ${GREEN_ACCENT}`,
    borderColor: GREEN_ACCENT,
    boxShadow: 'none',
    borderRadius: '0.75rem',
  };

  const styleWhenInvalid: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    border: `1px solid ${RED_ACCENT}`,
    borderColor: RED_ACCENT,
    boxShadow: 'none',
    borderRadius: '0.75rem',
  };

  const computedStyle: React.CSSProperties | undefined = isAriaInvalid
    ? styleWhenInvalid
    : isFocused
      ? styleWhenFocusedAndNotInvalid
      : styleWhenNotInvalidAndNotFocused;

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-grey-x-dark selection:text-bone selection:bg-blue-500 flex h-12 w-full min-w-0 rounded-xl bg-transparent px-3 py-1 text-base text-night-sky shadow-xs transition-all duration-200 ease-in-out outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-base file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base',
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