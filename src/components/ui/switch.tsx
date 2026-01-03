
'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/utils';

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-6 w-10 md:h-7 md:w-12 shrink-0 cursor-pointer items-center rounded-full border-none transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#53C904] data-[state=unchecked]:bg-[#BDBDBD]',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 md:h-6 md:w-6 rounded-full bg-white shadow-sm ring-0 transition-transform data-[state=unchecked]:translate-x-0.5 data-[state=checked]:translate-x-[18px] md:data-[state=checked]:translate-x-[22px]'
      )}
    />
  </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };