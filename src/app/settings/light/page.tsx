'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { useApi } from '@/hooks/useApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type UpdateSettingsResponse = {
  message: string;
  settings: any;
};

type PeriodType = 'day' | 'week' | 'month';

type ChartDataResponse = {
  period: PeriodType;
  parameter: string;
  totalRecords: number;
  data: any[];
  averages: Record<string, number>;
};

export default function LightSettingsPage() {
  const router = useRouter();
  const { post, get } = useApi<UpdateSettingsResponse | ChartDataResponse>();
  const [lightValue, setLightValue] = useState<number>(50);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('day');
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock energy consumption data
  const weeklyEnergyConsumption = 245; // kWh
  const totalEnergyConsumption = 1847; // kWh
  const currentPower = 125; // watts
  const recommendedPower = 150; // watts

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const response = await get(`/api/settings/history?period=${selectedPeriod}&parameter=light`);
        if (response && (response as ChartDataResponse).data) {
          setChartData((response as ChartDataResponse).data);
        } else {
          // Mock data if API doesn't return data
          setChartData([
            { time: '00:00', value: 45 },
            { time: '04:00', value: 30 },
            { time: '08:00', value: 75 },
            { time: '12:00', value: 90 },
            { time: '16:00', value: 85 },
            { time: '20:00', value: 60 },
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch chart data:', err);
        // Mock data fallback
        setChartData([
          { time: '00:00', value: 45 },
          { time: '04:00', value: 30 },
          { time: '08:00', value: 75 },
          { time: '12:00', value: 90 },
          { time: '16:00', value: 85 },
          { time: '20:00', value: 60 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedPeriod, get]);

  const handleSave = async () => {
    try {
      await post('/api/settings/update', {
        light: lightValue.toString(),
      });
      router.back();
    } catch (err) {
      console.error('Failed to save light settings:', err);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="sm"
            className="px-2"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <h1 className="text-lg font-bold text-gray-800">Light Settings</h1>
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Period Selector */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex gap-2">
              {(['day', 'week', 'month'] as PeriodType[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Light Intensity Chart</h3>
            <div className="h-64">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Energy Consumption */}
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Weekly Energy</p>
                <p className="text-xl font-bold text-gray-800">{weeklyEnergyConsumption} kWh</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Energy</p>
                <p className="text-xl font-bold text-gray-800">{totalEnergyConsumption} kWh</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <div>
                <p className="text-sm text-gray-600">Current Power</p>
                <p className="text-lg font-semibold">{currentPower} W</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Recommended</p>
                <p className="text-lg font-semibold text-green-600">{recommendedPower} W</p>
              </div>
            </div>
          </div>

          {/* Settings Control */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Light Level: {lightValue}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lightValue}
                  onChange={(e) => setLightValue(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              <Button
                onClick={handleSave}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="settings" />
    </div>
  );
}
