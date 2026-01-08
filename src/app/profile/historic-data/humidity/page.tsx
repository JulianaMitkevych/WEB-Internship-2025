'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils';
import { ChevronLeft, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { useTheme } from '@/hooks/useTheme';
import HumidityIcon from '@/assets/svg/HumidityIcon';
import { SmartChart } from '@/components/SmartChart/SmartChart';
import { useChartData } from '@/hooks/useChartData';
import { TChartPeriod } from '@/types/types';

export default function HumidityHistoricDataPage() {
  const router = useRouter();
  const { classes: themeClasses } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<TChartPeriod>('week');

  const { chartData, loading, error } = useChartData({
    parameter: 'humidity',
    period: selectedPeriod,
  });

  // Calculate max and min values from chart data
  const { maxValue, minValue } = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return { maxValue: null, minValue: null };
    }

    const values = chartData.map(point => point.value);
    const max = Math.max(...values);
    const min = Math.min(...values);

    return {
      maxValue: max,
      minValue: min,
    };
  }, [chartData]);

  return (
    <div className={`flex flex-col max-w-[768px] mx-auto ${themeClasses.background}`}>
      {/* Header */}
      <div className="p-4 flex items-center">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="icon"
          className="mr-2 hover:bg-transparent hover:opacity-70 transition-opacity active:scale-95"
        >
          <ChevronLeft className="size-6 stroke-[3px]" />
        </Button>
        <h1 className="text-[24px]  text-black font-bold">Humidity</h1>
      </div>

      {/* Info Section */}
      <div className="px-6 py-2 flex items-center justify-between ">
        <div className="flex items-center gap-2">
          <div className="text-[#53C904]">
            <HumidityIcon className="size-8 sm:size-10" />
          </div>
          <p className="text-[#808080] text-[12px] md:text-[16px] leading-tight w-full">
            Historical humidity data for your crop.
          </p>
        </div>
        <span className="text-[22px]  sm:tex-[24px] font-bold text-[#53C904]">
          {maxValue ? `${maxValue}%` : '65%'}
        </span>
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
              unit="%"
            />
          )}
        </div>
      </div>

      {/* Max/Min Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 px-4 mt-10 justify-items-center pb-20">
        <div
          className={`${themeClasses.cardBackground} flex flex-col justify-center p-[12px] sm:p-[20px] pr-[27px] rounded-[12px] w-full sm:w-[300px] h-[80px] sm:h-[120px] ${themeClasses.shadow} ${themeClasses.border}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <ArrowUp className="size-4 text-red-500" />
            <div className="text-red-500 font-bold text-[clamp(20px,6vw,28px)] leading-tight">
              {maxValue !== null ? `${maxValue}%` : 'N/A'}
            </div>
          </div>
          <div className={`${themeClasses.textPrimary} font-semibold text-[clamp(14px,4vw,16px)]`}>
            Maximum
          </div>
        </div>

        <div
          className={`${themeClasses.cardBackground} flex flex-col justify-center p-[12px] sm:p-[20px] pr-[27px] rounded-[12px] w-full sm:w-[300px] h-[80px] sm:h-[120px] ${themeClasses.shadow} ${themeClasses.border}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <ArrowDown className="size-4 text-blue-500" />
            <div className="text-blue-500 font-bold text-[clamp(20px,6vw,28px)] leading-tight">
              {minValue !== null ? `${minValue}%` : 'N/A'}
            </div>
          </div>
          <div className={`${themeClasses.textPrimary} font-semibold text-[clamp(14px,4vw,16px)]`}>
            Minimum
          </div>
        </div>
      </div>

      <BottomNavigation activeTab="profile" />
    </div>
  );
}
