'use client';

import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EStatistickPeriod } from '@/utils/enums';

type TPeriodSelectorProps = {
  activeTab: EStatistickPeriod;
  selectedDate: Date;
  locale: string;
  className?: string;
  onChange: (newDate: Date) => void;
  disablePrev?: boolean;
  disableNext?: boolean;
};

export function PeriodSelector({
  activeTab,
  selectedDate,
  locale,
  className,
  onChange,
  disablePrev,
  disableNext,
}: TPeriodSelectorProps) {
  const dateSelector = useMemo(() => {
    const currentDate = dayjs(selectedDate);

    if (activeTab === EStatistickPeriod.HOURLY) {
      const prevDay = currentDate.subtract(1, 'day');
      const nextDay = currentDate.add(1, 'day');
      return {
        prev: {
          label: prevDay.locale(locale).format('MMM D'),
          date: prevDay.toDate(),
        },
        current: {
          label: currentDate.locale(locale).format('MMMM D'),
          date: currentDate.toDate(),
        },
        next: {
          label: nextDay.locale(locale).format('MMM D'),
          date: nextDay.toDate(),
        },
      };
    }

    if (activeTab === EStatistickPeriod.DAILY) {
      const prevMonth = currentDate.subtract(1, 'month');
      const nextMonth = currentDate.add(1, 'month');
      return {
        prev: {
          label: prevMonth.locale(locale).format('MMM'),
          date: prevMonth.toDate(),
        },
        current: {
          label: currentDate.locale(locale).format('MMMM'),
          date: currentDate.toDate(),
        },
        next: {
          label: nextMonth.locale(locale).format('MMM'),
          date: nextMonth.toDate(),
        },
      };
    }

    const currentYear = currentDate.year();
    const prevYear = currentYear - 1;
    const nextYear = currentYear + 1;
    return {
      prev: { label: String(prevYear), date: new Date(prevYear, 0, 1) },
      current: {
        label: String(currentYear),
        date: new Date(currentYear, 0, 1),
      },
      next: { label: String(nextYear), date: new Date(nextYear, 0, 1) },
    };
  }, [activeTab, selectedDate, locale]);

  const handlePrev = () => {
    if (!disablePrev) onChange(dateSelector.prev.date);
  };
  const handleNext = () => {
    if (!disableNext) onChange(dateSelector.next.date);
  };

  return (
    <div
      className={`flex items-center justify-between w-full max-w-[300px] ${className || ''}`}
    >
      <button
        onClick={handlePrev}
        className={`flex items-center gap-2 w-[90px] text-grey-xxx-dark hover:text-night-sky transition-colors ${disablePrev ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
        aria-label="Previous period"
        disabled={!!disablePrev}
      >
        <ChevronLeft className="w-5 h-5 shrink-0" />
        <p className="truncate text-sm">{dateSelector.prev.label}</p>
      </button>

      <p className="w-[120px] text-center truncate text-night-sky font-semibold text-base">
        {dateSelector.current.label}
      </p>

      <button
        onClick={handleNext}
        className={`flex items-center gap-2 w-[90px] justify-end text-grey-xxx-dark hover:text-night-sky transition-colors ${disableNext ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
        aria-label="Next period"
        disabled={!!disableNext}
      >
        <p className="truncate text-sm">{dateSelector.next.label}</p>
        <ChevronRight className="w-5 h-5 shrink-0" />
      </button>
    </div>
  );
}

export default PeriodSelector;
