
'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils';
import {
  ChevronLeft,
  ArrowUpNarrowWide,
  ArrowDownNarrowWide,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { useTheme } from '@/hooks/useTheme';
import { SmartChart } from '@/components/SmartChart/SmartChart';
import { useChartData } from '@/hooks/useChartData';
import { TChartPeriod } from '@/types/types';

export default function TemperatureHistoricDataPage() {
  const router = useRouter();
  const { classes: themeClasses } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<TChartPeriod>('week');

  const { chartData, loading, error } = useChartData({
    parameter: 'temperature',
    period: selectedPeriod,
  });

  const { maxPoint, minPoint } = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return { maxPoint: null, minPoint: null };
    }

    const max = chartData.reduce((prev, current) =>
      prev.value > current.value ? prev : current
    );
    const min = chartData.reduce((prev, current) =>
      prev.value < current.value ? prev : current
    );

    return {
      maxPoint: max,
      minPoint: min,
    };
  }, [chartData]);

  return (
    <div
      className={`flex flex-col max-w-[768px] px-4 sm:px-12 mx-auto ${themeClasses.background}`}
    >
      {/* Header */}
      <div className="py-3 px-4 flex items-center">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="icon"
          className="mr-2 hover:bg-transparent hover:opacity-70 transition-opacity active:scale-95"
        >
          <ChevronLeft className="size-6 stroke-[3px]" />
        </Button>
        <h1 className={`text-[24px] ${themeClasses.textPrimary} font-bold`}>Temperature</h1>
      </div>

      {/* Tabs */}
      <div className="px-6 mt-6">
        <div className="flex border-b border-gray-100 relative">
          {(['Day', 'Week', 'Month'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p.toLowerCase() as TChartPeriod)}
              className={cn(
                'flex-1 py-3 text-sm font-semibold transition-all relative z-10',
                selectedPeriod === p.toLowerCase()
                  ? 'text-[#53C904]'
                  : 'text-gray-300'
              )}
            >
              {p}
              {selectedPeriod === p.toLowerCase() && (
                <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#65D11F] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Block */}
      <div className="mx-4 mt-8 p-1 sm:px-2">
        <div className="h-64 w-full relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
              <div className="size-6 border-2 border-[#53C904] border-t-transparent animate-spin rounded-full" />
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
              <div className="text-red-500 text-sm">{error}</div>
            </div>
          ) : (
            <SmartChart
              data={chartData}
              period={selectedPeriod}
              color="#65D11F"
              unit="`C"
            />
          )}
        </div>
      </div>

      {/* Max/Min Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 px-1 sm:px-6 mt-10 pb-20">
        {/* Lowest Card */}
        <div
          className={`${themeClasses.cardBackground} p-4 rounded-[12px] ${themeClasses.shadow} ${themeClasses.border} flex flex-col gap-1`}
        >
          <div className="flex items-center gap-1 sm:gap-4">
            <ArrowDownNarrowWide className="size-5 sm:size-8 text-[#2F7302]" />
            <span className="${themeClasses.textPrimary} font-semibold text-[16px] sm:text-[22px]">
              Lowest
            </span>
          </div>
          <div className="text-[#53C904] font-bold text-[24px] leading-tight">
            {minPoint !== null ? `${minPoint.value}\`C` : '--\`C'}
          </div>
          <div className="${themeClasses.textPrimary} text-[16px]">
            {minPoint?.date
              ? new Date(minPoint.date).toLocaleDateString('uk-UA')
              : '00.00.0000'}
          </div>
        </div>

        {/* Highest Card */}
        <div
          className={`${themeClasses.cardBackground} p-4 rounded-[12px] ${themeClasses.shadow} ${themeClasses.border} flex flex-col gap-1`}
        >
          <div className="flex items-center gap-1 sm:gap-4">
            <ArrowUpNarrowWide className="size-5 sm:size-8 text-[#2F7302]" />
            <span className="${themeClasses.textPrimary} text-[16px] font-semibold sm:text-[22px]">
              Highest
            </span>
          </div>
          <div className="text-[#53C904] font-bold text-[24px] leading-tight">
            {maxPoint !== null ? `${maxPoint.value}\`C` : '--\`C'}
          </div>
          <div className="${themeClasses.textPrimary} text-[16px]">
            {maxPoint?.date
              ? new Date(maxPoint.date).toLocaleDateString('uk-UA')
              : '00.00.0000'}
          </div>
        </div>
      </div>

      <BottomNavigation activeTab="profile" />
    </div>
  );
}