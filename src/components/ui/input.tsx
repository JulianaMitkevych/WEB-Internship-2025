// import * as React from 'react';

// import { cn } from '../../utils';
// import { CSSProperties } from 'react';
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
//     backgroundImage:
//       'linear-gradient(94.99deg, #FCF9F2 -15.53%, #FFFDF6 132.51%), linear-gradient(181.78deg, #EEE5D2 0.25%, rgba(250, 247, 240, 0) 48.39%, rgba(235, 227, 208, 0.29) 98.49%)',
//     backgroundOrigin: 'border-box',
//     backgroundClip: 'padding-box, border-box',
//     border: '1px solid transparent',
//     boxShadow:
//       '1px 1px 5px 0px #F2E8D3CC inset, -4px -4px 5px 0px #FFFEFC inset',
//   };

//   const styleWhenFocusedAndNotInvalid: React.CSSProperties = {
//     background: 'transparent',
//     border: '1px solid',
//     borderColor: 'var(--color-input-border)',
//     boxShadow: 'none',
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
//         'file:text-foreground placeholder:text-grey-x-dark selection:text-bone selection:bg-blue-500 flex h-11 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-base text-night-sky shadow-xs transition-all duration-200 ease-in-out outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-base file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base',
//         'border-gray-200 dark:border-gray-800',
//         // Focused state should show night-sky border
//         'focus-visible:border-night-sky',
//         // Error state: solid red border, no gradient/shadow
//         'aria-invalid:border-destructive aria-invalid:shadow-none dark:aria-invalid:border-destructive',
//         // Keep red border on focus when invalid
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
    backgroundImage:
      'linear-gradient(94.99deg, #FCF9F2 -15.53%, #FFFDF6 132.51%), linear-gradient(181.78deg, #EEE5D2 0.25%, rgba(250, 247, 240, 0) 48.39%, rgba(235, 227, 208, 0.29) 98.49%)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    border: '1px solid transparent',
    boxShadow:
      '1px 1px 5px 0px #F2E8D3CC inset, -4px -4px 5px 0px #FFFEFC inset',
  };

  const styleWhenFocusedAndNotInvalid: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    border: `1px solid ${GREEN_ACCENT}`,
    borderColor: GREEN_ACCENT,
    boxShadow: 'none',
    borderRadius: '0.75rem',
  };

  const computedStyle: React.CSSProperties | undefined = isAriaInvalid
    ? undefined
    : isFocused
      ? styleWhenFocusedAndNotInvalid
      : styleWhenNotInvalidAndNotFocused;

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-grey-x-dark selection:text-bone selection:bg-blue-500 flex h-12 w-full min-w-0 rounded-xl border bg-transparent px-3 py-1 text-base text-night-sky shadow-xs transition-all duration-200 ease-in-out outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-base file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base',
        'border-gray-200 dark:border-gray-800',
        'focus-visible:border-night-sky',
        'aria-invalid:border-destructive aria-invalid:shadow-none dark:aria-invalid:border-destructive',
        'aria-invalid:focus-visible:border-destructive',
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
