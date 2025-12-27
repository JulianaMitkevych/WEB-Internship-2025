'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { useApi } from '@/hooks/useApi';
import TempIcon from '@/assets/svg/TempIcon';
import { SmartChart } from '@/components/SmartChart/SmartChart';

type PeriodType = 'day' | 'week' | 'month';

export default function TemperatureSettingsPage() {
  const router = useRouter();
  const { get } = useApi<any>();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('week');
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Дані для графіку згідно з макетом (24, 26, 23, 28, 24, 26, 23)
  const getMockData = (period: PeriodType) => {
    if (period === 'day') {
      return [
        { name: '08:00', value: 22 },
        { name: '12:00', value: 25 },
        { name: '16:00', value: 24 },
        { name: '20:00', value: 21 },
        { name: '00:00', value: 20 },
      ];
    }
    if (period === 'month') {
      return Array.from({ length: 30 }, (_, i) => ({
        name: (i + 1).toString(),
        value: Math.floor(Math.random() * 8) + 20,
      }));
    }
    // Default: Week (точно як на макеті)
    return [
      { name: 'Mon', date: '08', value: 24 },
      { name: 'Tue', date: '09', value: 26 },
      { name: 'Wed', date: '10', value: 23 },
      { name: 'Thu', date: '11', value: 28 },
      { name: 'Fri', date: '12', value: 24 },
      { name: 'Sat', date: '13', value: 26 },
      { name: 'Sun', date: '14', value: 23 },
    ];
  };

  // Метрики точно за вашим макетом
  const metrics = useMemo(
    () => [
      { label: 'Current', value: '24 °C' },
      { label: 'Recommended', value: '26 °C' },
      { label: 'Week', value: '60 kw' },
      { label: 'Total', value: '456 kw' },
    ],
    []
  );

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const response = await get(
          `/api/settings/history?period=${selectedPeriod}&parameter=temperature`
        );
        if (response?.data) {
          setChartData(response.data);
        } else {
          setChartData(getMockData(selectedPeriod));
        }
      } catch {
        setChartData(getMockData(selectedPeriod));
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };
    fetchChartData();
  }, [selectedPeriod]);

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
        <h1 className="text-2xl font-bold">Temperature</h1>
      </div>

      {/* Info Section */}
      <div className="px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-[#53C904]">
            <TempIcon />
          </div>
          <p className="text-[#808080] text-[12px] md:text-[16px] leading-tight w-full max-w-[200px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </p>
        </div>
        <span className="text-4xl font-bold text-[#53C904]">24 °C</span>
      </div>

      {/* Tabs */}
      <div className="px-6 mt-6">
        <div className="flex border-b border-gray-100 relative">
          {(['Day', 'Week', 'Month'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p.toLowerCase() as PeriodType)}
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
              data={chartData}
              period={selectedPeriod}
              color="#65D11F"
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
