
'use client';

import React from 'react';
import { Select } from '@/components/ui/index';

type MonthOption = { value: number; label: string };

type TChartPeriodControlsProps = {
  years: ReadonlyArray<number> | number[];
  months: MonthOption[];
  selectedYear: number;
  selectedMonth?: number;
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
      className={`flex items-center gap-3 w-full sm:w-auto p-2  ${className || ''}`}
    >
      <Select
        options={years.map((year) => ({ value: year, label: year.toString() }))}
        value={selectedYear}
        onValueChange={(value) => onYearChange(Number(value))}
        size={size}
        className="w-full bg-white border-none "
        placeholder={labels?.yearPlaceholder}
      />

      <Select
        options={[
          { value: '', label: labels?.monthPlaceholder || 'All Months' },
          ...months,
        ]}
        value={typeof selectedMonth === 'number' ? selectedMonth : ''}
        onValueChange={(value) => {
          onMonthChange(value === '' ? undefined : Number(value));
        }}
        size={size}
        className="w-full bg-white border-none"
        placeholder={labels?.monthPlaceholder}
      />
    </div>
  );
}
