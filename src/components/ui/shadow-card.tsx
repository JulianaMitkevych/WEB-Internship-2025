'use client';

import React, { useRef, useLayoutEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils';

type TShadowCardProps = {
  top: React.ReactNode;
  bottom: React.ReactNode;
  hideBottom?: boolean;
  className?: string;
};

export function ShadowCard({
  top,
  bottom,
  className,
  hideBottom = false,
}: TShadowCardProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [bottomHeight, setBottomHeight] = useState<number>(0);

  useLayoutEffect(() => {
    if (bottomRef.current) {
      const height = bottomRef.current.offsetHeight;
      setBottomHeight(height);
    }
  }, [bottom]);

  const shouldShowBottom = !hideBottom && bottomHeight > 32;

  return (
    <div
      className={cn(
        'w-full relative rounded-lg overflow-hidden p-[1px] gradient-shadow',
        className
      )}
    >
      <div className="absolute inset-0 rounded-lg bg-[linear-gradient(180deg,_#EEE5D2_0%,_rgba(250,247,240,0)_50%,_rgba(235,227,208,0)_100%)]" />
      <div className="rounded-lg relative bg-bone-white text-card-foreground w-full h-full flex flex-col min-w-[258px]">
        <div className="flex-1">{top}</div>
        <div
          ref={bottomRef}
          className="invisible absolute h-auto w-full"
          aria-hidden="true"
          style={{ position: 'absolute', visibility: 'hidden' }}
        >
          {bottom}
        </div>
        {shouldShowBottom && (
          <>
            <Separator />
            {bottom}
          </>
        )}
      </div>
    </div>
  );
}

export default ShadowCard;
