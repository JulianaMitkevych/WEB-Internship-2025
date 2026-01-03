'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, BarChart3, Calendar, TrendingUp, Droplets, Thermometer, Sun } from 'lucide-react';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { useStorage } from '@/hooks/useStorage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HistoricDataPage() {
  const router = useRouter();
  const [store] = useStorage();

  // Mock historical data for demonstration
  const mockHistoricData = {
    totalHarvests: 12,
    averageYield: '2.5 kg',
    bestPerformingCrop: store.user?.cropType || 'Microgreens',
    environmentalData: {
      avgTemperature: '22°C',
      avgHumidity: '65%',
      avgLight: '12 hours/day',
    },
    monthlyData: [
      { month: 'Jan', yield: 2.1, temperature: 21, humidity: 62 },
      { month: 'Feb', yield: 2.3, temperature: 22, humidity: 64 },
      { month: 'Mar', yield: 2.8, temperature: 23, humidity: 66 },
      { month: 'Apr', yield: 2.2, temperature: 22, humidity: 63 },
      { month: 'May', yield: 2.6, temperature: 24, humidity: 67 },
      { month: 'Jun', yield: 2.4, temperature: 23, humidity: 65 },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-md mx-auto w-full px-6 py-8 flex flex-col min-h-screen">
        {/* Header */}
        <div className="mb-8 w-full">
          <button
            onClick={() => router.back()}
            className="mb-[16px] p-1 -ml-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="size-7 sm:size-8 text-black" />
          </button>

          <h1 className="text-[28px] text-center font-bold text-black leading-tight">
            Historic Data
          </h1>

          <p className="text-center text-gray-600 mt-2">
            Your growing history and analytics
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center">
              <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">
                {mockHistoricData.totalHarvests}
              </div>
              <div className="text-xs text-gray-600">Total Harvests</div>
            </Card>

            <Card className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">
                {mockHistoricData.averageYield}
              </div>
              <div className="text-xs text-gray-600">Avg Yield</div>
            </Card>
          </div>

          {/* Best Performing Crop */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Best Performing Crop</h3>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-700">{mockHistoricData.bestPerformingCrop}</span>
            </div>
          </Card>

          {/* Environmental Conditions */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Average Conditions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Thermometer className="w-4 h-4 text-red-500 mr-2" />
                  <span className="text-sm text-gray-600">Temperature</span>
                </div>
                <span className="font-medium">{mockHistoricData.environmentalData.avgTemperature}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Droplets className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">Humidity</span>
                </div>
                <span className="font-medium">{mockHistoricData.environmentalData.avgHumidity}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Sun className="w-4 h-4 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-600">Light</span>
                </div>
                <span className="font-medium">{mockHistoricData.environmentalData.avgLight}</span>
              </div>
            </div>
          </Card>

          {/* Monthly Data */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Monthly Performance</h3>
            <div className="space-y-3">
              {mockHistoricData.monthlyData.map((data) => (
                <div key={data.month} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <span className="font-medium text-gray-700">{data.month}</span>
                  <div className="text-right">
                    <div className="text-sm font-medium">{data.yield} kg</div>
                    <div className="text-xs text-gray-500">
                      {data.temperature}°C • {data.humidity}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Export Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // TODO: Implement data export functionality
              console.log('Export functionality will be implemented');
            }}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Bottom spacing for navigation */}
        <div className="h-20"></div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="profile" />
    </div>
  );
}
