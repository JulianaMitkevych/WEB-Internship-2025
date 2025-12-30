'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import LightIcon from '@/assets/svg/LightIcon';
import { SmartChart } from '@/components/SmartChart/SmartChart';
import { useChartData } from '@/hooks/useChartData'; //import hook
import { TChartPeriod } from '@/types/types'; 

export default function LightSettingsPage() {
  const router = useRouter();
  
  const [selectedPeriod, setSelectedPeriod] = useState<TChartPeriod>('week'); // use TChartPeriod

  // call hook useChartData
  const { chartData, loading } = useChartData({
    parameter: 'light', // 'light' as a parameter
    period: selectedPeriod, // selected period
  });

  const metrics = useMemo(
    () => [
      { label: 'Current', value: '60%' },
      { label: 'Recommended', value: '72%' },
      { label: 'Week', value: '60 kw' },
      { label: 'Total', value: '456 kw' },
    ],
    []
  );

  return (
    <div className="flex flex-col max-w-[768px] mx-auto">
      {/* Header */}
      <div className="p-4 flex items-center">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="icon"
          className="mr-2"
        >
          <ChevronLeft className="size-8 stroke-[3px]" />
        </Button>
        <h1 className="text-2xl font-bold">Light</h1>
      </div>

      {/* Info Section */}
      <div className="px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-[#53C904]">
            <LightIcon />
          </div>
          <p className="text-[#808080] text-[12px] md:text-[16px] leading-tight w-full">
            Adjust the light intensity for your plants growth cycles.
          </p>
        </div>
        {/*!!!  `settings` або `chartData`!!! */}
        <span className="text-4xl font-bold text-[#53C904]">60%</span>
      </div>

      {/* Tabs */}
      <div className="px-6 mt-6">
        <div className="flex border-b border-gray-100 relative">
          {(['Day', 'Week', 'Month'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p.toLowerCase() as TChartPeriod)} // use TChartPeriod
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
      <div className="mx-4 mt-8 bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden">
        <div className="h-64 w-full relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
              <div className="size-6 border-2 border-[#53C904] border-t-transparent animate-spin rounded-full" />
            </div>
          ) : (
            <SmartChart
              data={chartData} // chartDatа
              period={selectedPeriod}
              color="#65D11F"
              unit="%" // for light
            />
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 px-4 mt-10 justify-items-center pb-24">
        {metrics.map((item) => (
          <div
            key={item.label}
            className="bg-white flex flex-col justify-center p-[12px] pr-[27px] rounded-[12px] w-full md:w-[300px] h-[80px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50"
          >
            <div className="font-bold text-[#53C904] text-[clamp(20px,6vw,28px)] leading-tight mb-1">
              {item.value}
            </div>
            <div className="text-black font-semibold text-[clamp(14px,4vw,16px)]">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      <BottomNavigation activeTab="settings" />
    </div>
  );
}
