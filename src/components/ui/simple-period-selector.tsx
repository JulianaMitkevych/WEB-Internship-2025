'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

type PeriodType = 'daily' | 'weekly' | 'monthly';

type TSimplePeriodSelectorProps = {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  className?: string;
};

export function SimplePeriodSelector({
  selectedPeriod,
  onPeriodChange,
  className,
}: TSimplePeriodSelectorProps) {
  const periods: { value: PeriodType; label: string }[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <span className="text-sm font-medium text-gray-700">Period:</span>
      <div className="flex bg-gray-100 rounded-lg p-1">
        {periods.map((period) => (
          <Button
            key={period.value}
            variant={selectedPeriod === period.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPeriodChange(period.value)}
            className={`px-3 py-1 text-xs ${
              selectedPeriod === period.value
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            {period.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default SimplePeriodSelector;
