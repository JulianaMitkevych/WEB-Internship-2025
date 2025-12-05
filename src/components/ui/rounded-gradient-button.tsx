import React from 'react';
import { cn } from '@/utils';

interface RoundedGradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function RoundedGradientButton({
  children,
  className,
  onClick = () => console.log(),
  ...props
}: RoundedGradientButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-gradient-button-border py-1.5 px-3 bg-bone text-rock font-normal text-base flex gap-1 items-center justify-center relative cursor-pointer leading-none rounded-full hover:opacity-80 disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
