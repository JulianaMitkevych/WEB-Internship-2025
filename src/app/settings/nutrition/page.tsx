'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils';
import { ChevronLeft } from 'lucide-react';
import { useChartData } from '@/hooks/useChartData';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import NutritionIcon from '@/assets/svg/NutritionIcon';
import { SmartChart } from '@/components/SmartChart/SmartChart';
import { TChartPeriod } from '@/types/types';

export default function NutritionSettingsPage() {
  const router = useRouter();
  const { classes: themeClasses } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<TChartPeriod>('week');

  const { chartData, loading, error } = useChartData({
    parameter: 'nutrition',
    period: selectedPeriod,
  });

  const metrics = useMemo(
    () => [
      { label: 'Current', value: '78%' },
      { label: 'Recommended', value: '65%' },
      { label: 'Week', value: '15 mg' },
      { label: 'Total', value: '24 mg' },
    ],
    []
  );

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
          <ChevronLeft className={`size-6 stroke-[3px] ${themeClasses.textPrimary}`} />
        </Button>
        <h1 className={`text-[24px] font-bold ${themeClasses.textPrimary}`}>Nutrition</h1>
      </div>

      {/* Info Section */}
      <div className="px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-[#53C904]">
            <NutritionIcon className="size-7 sm:size-8" />
          </div>
          <p className="text-[#808080] text-[12px] md:text-[16px] leading-tight w-full">
            Monitor the nutrient balance for plant
            development.
          </p>
        </div>
        <span className="text-[24px] font-bold text-[#53C904]">78%</span>
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

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 px-4 mt-10 justify-items-center pb-20">
        {metrics.map((item) => (
          <div
            key={item.label}
            className={`${themeClasses.cardBackground} flex flex-col justify-center p-[12px] sm:p-[20px] pr-[27px] rounded-[12px] w-full sm:w-[300px] h-[80px] sm:h-[120px] ${themeClasses.shadow} ${themeClasses.border}`}
          >
            <div className="font-bold text-[#53C904] text-[clamp(20px,6vw,28px)] leading-tight mb-1">
              {item.value}
            </div>
            <div className={`font-semibold text-[clamp(14px,4vw,16px)] ${themeClasses.textPrimary}`}>
              {item.label}
            </div>
          </div>
        ))}
      </div>

      <BottomNavigation activeTab="settings" />
    </div>
  );
}
