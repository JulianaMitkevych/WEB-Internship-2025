'use client';

import React from 'react';
import { cn } from '@/utils';
import { useTranslation } from 'react-i18next';

export type UnderlineTab = {
  value: string;
  label: string;
};

type UnderlineTabsProps = {
  tabs: UnderlineTab[];
  activeValue: string;
  onChange: (value: string) => void;
  className?: string;
};

export function UnderlineTabs({
  tabs,
  activeValue,
  onChange,
  className,
}: UnderlineTabsProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn('flex items-end gap-4 border-b border-sand/60', className)}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === activeValue;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              'p-2 pb-1 -mb-[1px] text-base transition-colors border-b-2 border-transparent whitespace-nowrap',
              isActive
                ? 'text-night-sky border-rock'
                : 'text-grey-xxx-dark hover:text-night-sky'
            )}
          >
            <span>{t(tab.label)}</span>
          </button>
        );
      })}
    </div>
  );
}
