
'use client'
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { Calendar } from '@/components/ui/calendar';
import { useApi } from '@/hooks/useApi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import LightIcon from '@/assets/svg/LightIcon';
import { cn } from '@/utils';

type PeriodType = 'day' | 'week' | 'month';

export default function LightSettingsPage() {
  const router = useRouter();
  const { get } = useApi<any>();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('week');
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const metrics = useMemo(
    () => [
      { label: 'Current', value: '60%' },
      { label: 'Recommended', value: '72%' },
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
          `/api/settings/history?period=${selectedPeriod}&parameter=light`
        );
        if (response && response.data) {
          setChartData(response.data);
        } else {
          setChartData([
            { name: 'Mon', date: '08', value: 20 },
            { name: 'Tue', date: '09', value: 36 },
            { name: 'Wed', date: '10', value: 18 },
            { name: 'Thu', date: '11', value: 60 },
            { name: 'Fri', date: '12', value: 40 },
            { name: 'Sat', date: '13', value: 25 },
            { name: 'Sun', date: '14', value: 18 },
          ]);
        }
      } catch{
        setChartData([
          { name: 'Mon', date: '08', value: 20 },
          { name: 'Tue', date: '09', value: 36 },
          { name: 'Wed', date: '10', value: 18 },
          { name: 'Thu', date: '11', value: 60 },
          { name: 'Fri', date: '12', value: 40 },
          { name: 'Sat', date: '13', value: 25 },
          { name: 'Sun', date: '14', value: 18 },
        ]);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchChartData();
  }, [selectedPeriod, get]);

  return (
    <div className="min-h-screen bg-white flex flex-col pb-24">
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

      <div className="px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-[#65D11F]">
            <LightIcon />
          </div>
          <p className="text-gray-400 text-[13px] leading-tight max-w-[160px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </p>
        </div>
        <span className="text-4xl font-bold text-[#65D11F]">60%</span>
      </div>

      <div className="px-6 mt-6">
        <div className="flex border-b border-gray-100 relative">
          {(['Day', 'Week', 'Month'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p.toLowerCase() as PeriodType)}
              className={cn(
                'flex-1 py-3 text-sm font-semibold transition-all relative z-10',
                selectedPeriod === p.toLowerCase()
                  ? 'text-[#65D11F]'
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

      <div className="mx-4 mt-8 p-4 bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-row min-h-[260px]">
        <div className="w-[42%] border-r border-gray-50 pr-2">
          <Calendar
            mode="single"
            selected={new Date()}
            className="p-0 scale-90 origin-top-left"
            classNames={{
              month_caption: 'hidden',
              nav: 'hidden',
              head_cell: 'text-gray-400 font-normal text-[10px]',
              cell: 'p-0',
              day: 'h-7 w-7 text-[11px] font-medium p-0',
              day_selected:
                'bg-[#65D11F] text-white rounded-full hover:bg-[#65D11F]',
              day_today: 'text-[#65D11F] font-bold',
            }}
          />
        </div>

        <div className="w-[58%] pl-3 flex flex-col relative">
          <h3 className="text-gray-700 text-[13px] font-bold mb-6">
            Light Intensity Chart
          </h3>

          <div className="flex-1 w-full h-full relative min-h-[150px]">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                <div className="size-6 border-2 border-[#65D11F] border-t-transparent animate-spin rounded-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid horizontal={false} stroke="#F2F2F2" vertical />
                  <XAxis dataKey="name" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#65D11F"
                    strokeWidth={2}
                    dot={{
                      r: 3,
                      fill: '#fff',
                      stroke: '#65D11F',
                      strokeWidth: 2,
                    }}
                    label={({ x, y, value }) => (
                      <text
                        x={x}
                        y={y - 12}
                        fill="#65D11F"
                        fontSize={10}
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {value}%
                      </text>
                    )}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

            <div className="absolute bottom-[-5px] right-2 text-[10px] text-gray-400 font-medium">
              20:00
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 px-4 mt-8">
        {metrics.map((item) => (
          <div
            key={item.label}
            className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50"
          >
            <div className="text-3xl font-bold text-[#65D11F] mb-1">
              {item.value}
            </div>
            <div className="text-gray-900 font-bold text-sm">{item.label}</div>
          </div>
        ))}
      </div>

      <BottomNavigation activeTab="settings" />
    </div>
  );
}
