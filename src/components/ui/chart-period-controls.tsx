'use client';

import React from 'react';
import { Select } from '@/components/ui/index';

type MonthOption = { value: number; label: string };

type TChartPeriodControlsProps = {
  years: ReadonlyArray<number> | number[];
  months: MonthOption[];
  selectedYear: number;
  selectedMonth?: number; // undefined means no month filter
  onYearChange: (year: number) => void;
  onMonthChange: (month: number | undefined) => void;
  labels?: { yearPlaceholder?: string; monthPlaceholder?: string };
  className?: string;
  size?: 'sm' | 'md';
};

export function ChartPeriodControls({
  years,
  months,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
  labels,
  className,
  size = 'sm',
}: TChartPeriodControlsProps) {
  return (
    <div
      className={`flex items-center gap-3 w-full sm:w-auto ${className || ''}`}
    >
      <Select
        options={years.map((year) => ({ value: year, label: year.toString() }))}
        value={selectedYear}
        onValueChange={(value) => onYearChange(Number(value))}
        size={size}
        className="w-37"
        placeholder={labels?.yearPlaceholder}
      />

      <Select
        options={[
          { value: '', label: labels?.monthPlaceholder || '' },
          ...months,
        ]}
        value={typeof selectedMonth === 'number' ? selectedMonth : ''}
        onValueChange={(value) => {
          if (value === '') {
            onMonthChange(undefined);
          } else {
            onMonthChange(Number(value));
          }
        }}
        size={size}
        className="w-37"
        placeholder={labels?.monthPlaceholder}
      />
    </div>
  );
}

export default ChartPeriodControls;
