import * as React from 'react';

import { cn } from '@/utils';

import { Spinner, type SpinnerProps } from './spinner';

type TLoadingSpinnerProps = Omit<SpinnerProps, 'variant'> & {
  variant?: SpinnerProps['variant'];
  text?: string;
  overlay?: boolean;
  className?: string;
};

const LoadingSpinner = React.forwardRef<HTMLDivElement, TLoadingSpinnerProps>(
  (
    { variant = 'default', text, overlay = false, className, ...spinnerProps },
    ref
  ) => {
    const content = (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center gap-2',
          overlay &&
            'fixed inset-0 z-60 bg-background/30 backdrop-blur-sm text-rock-xx-dark',
          className
        )}
      >
        <Spinner variant={variant} {...spinnerProps} />
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    );

    return content;
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

export { LoadingSpinner };
