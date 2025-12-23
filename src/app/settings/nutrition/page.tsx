'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
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

export default function NutritionSettingsPage() {
  const router = useRouter();
  const { post, get } = useApi<UpdateSettingsResponse | ChartDataResponse>();
  const [nutritionValue, setNutritionValue] = useState<number>(75);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('day');
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock energy consumption data
  const weeklyEnergyConsumption = 134; // kWh
  const totalEnergyConsumption = 1008; // kWh
  const currentNutrition = 78; // %
  const recommendedNutrition = 80; // %

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const response = await get(`/api/settings/history?period=${selectedPeriod}&parameter=nutrition`);
        if (response && (response as ChartDataResponse).data) {
          setChartData((response as ChartDataResponse).data);
        } else {
          // Mock data if API doesn't return data
          setChartData([
            { time: '00:00', value: 65 },
            { time: '04:00', value: 60 },
            { time: '08:00', value: 80 },
            { time: '12:00', value: 85 },
            { time: '16:00', value: 82 },
            { time: '20:00', value: 75 },
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch chart data:', err);
        // Mock data fallback
        setChartData([
          { time: '00:00', value: 65 },
          { time: '04:00', value: 60 },
          { time: '08:00', value: 80 },
          { time: '12:00', value: 85 },
          { time: '16:00', value: 82 },
          { time: '20:00', value: 75 },
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
        nutrition: nutritionValue.toString(),
      });
      router.back();
    } catch (err) {
      console.error('Failed to save nutrition settings:', err);
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
          <h1 className="text-lg font-bold text-gray-800">Nutrition Settings</h1>
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
            <h3 className="text-lg font-semibold mb-4">Nutrition Chart</h3>
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
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
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
                <p className="text-sm text-gray-600">Current Nutrition</p>
                <p className="text-lg font-semibold">{currentNutrition}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Recommended</p>
                <p className="text-lg font-semibold text-green-600">{recommendedNutrition}%</p>
              </div>
            </div>
          </div>

          {/* Settings Control */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nutrient Level: {nutritionValue}%
                </label>
                <Slider
                  value={[nutritionValue]}
                  onValueChange={(value) => setNutritionValue(value[0])}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
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
