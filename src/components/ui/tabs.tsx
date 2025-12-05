'use client';

import { cn } from '@/utils';
import * as React from 'react';
import { GradientButton } from './gradient-button';
import { TTab } from '@/types/types';
import { useTranslation } from 'react-i18next';

type TTabsProps = {
  tabs: TTab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
  containerClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
};

export function Tabs({
  tabs,
  activeTab,
  onTabChange,
  className,
  containerClassName,
  activeClassName,
  inactiveClassName,
}: TTabsProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'relative flex items-center rounded-[10px] bg-white p-[1px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] min-w-0',
        containerClassName
      )}
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.value;
        const isNotLast = index < tabs.length - 1;

        const Icon = tab.icon;
        const content = (
          <>
            {!!Icon && (
              <span className="inline-flex items-center justify-center flex-shrink-0">
                <Icon size={20} color={isActive ? '#fffdf6' : '#757575'} />
              </span>
            )}
            <span className="truncate">{t(tab.label)}</span>
          </>
        );

        if (isActive) {
          return (
            <React.Fragment key={tab.value}>
              <GradientButton
                onClick={() => onTabChange(tab.value)}
                className={cn(
                  'flex-auto py-2 px-0 !text-base font-medium bg-rock text-bone gap-1 min-w-0 flex-shrink',
                  activeClassName,
                  className
                )}
                style={{
                  paddingTop: '8px',
                  paddingBottom: '8px',
                }}
              >
                {content}
              </GradientButton>
              {isNotLast && <div className="h-6 w-[1px] bg-sand mx-0.5" />}
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={tab.value}>
            <button
              onClick={() => onTabChange(tab.value)}
              className={cn(
                'flex items-center justify-center gap-1 flex-auto rounded-lg py-2 text-center text-base font-normal border border-transparent cursor-pointer hover:opacity-80 transition-all min-w-0 flex-shrink',
                inactiveClassName || 'bg-transparent text-grey-xxx-dark',
                className
              )}
            >
              {content}
            </button>
            {isNotLast && <div className="h-6 w-[1px] bg-sand mx-0.5" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
