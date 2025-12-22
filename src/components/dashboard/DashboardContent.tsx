'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApi } from '@/hooks/useApi';
import { SimplePeriodSelector } from '@/components/ui/simple-period-selector';
import { Lightbulb, Thermometer, Droplets, Beaker } from 'lucide-react';

type PeriodType = 'daily' | 'weekly' | 'monthly';

type SettingsHistoryResponse = {
  period: PeriodType;
  parameter: string;
  totalRecords: number;
  data: any[];
  averages: Record<string, number>;
};

const DashboardContent = () => {
  const { get, loading, error } = useApi<SettingsHistoryResponse>();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('daily');
  const [settingsData, setSettingsData] = useState<Record<string, SettingsHistoryResponse>>({});

  const parameters = ['light', 'temperature', 'humidity', 'nutrition'];

  useEffect(() => {
    const fetchSettingsData = async () => {
      const newData: Record<string, SettingsHistoryResponse> = {};

      for (const param of parameters) {
        try {
          const response = await get(`/api/settings/history?period=${selectedPeriod}&parameter=${param}`);
          if (response) {
            newData[param] = response;
          }
        } catch (err) {
          console.error(`Failed to fetch ${param} data:`, err);
        }
      }

      setSettingsData(newData);
    };

    fetchSettingsData();
  }, [selectedPeriod, get]);

  const getParameterIcon = (param: string) => {
    switch (param) {
      case 'light': return <Lightbulb className="size-5 text-yellow-500" />;
      case 'temperature': return <Thermometer className="size-5 text-red-500" />;
      case 'humidity': return <Droplets className="size-5 text-blue-500" />;
      case 'nutrition': return <Beaker className="size-5 text-purple-500" />;
      default: return null;
    }
  };

  const getParameterLabel = (param: string) => {
    switch (param) {
      case 'light': return 'Light Intensity';
      case 'temperature': return 'Temperature';
      case 'humidity': return 'Humidity';
      case 'nutrition': return 'Nutrition';
      default: return param;
    }
  };

  const getParameterUnit = (param: string) => {
    switch (param) {
      case 'light': return '%';
      case 'temperature': return '°C';
      case 'humidity': return '%';
      case 'nutrition': return '%';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#4CAF50]">
            🌱 Plant Settings Dashboard
          </h1>
          <SimplePeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {parameters.map((param) => {
            const data = settingsData[param];
            const average = data?.averages[param] || 0;
            const records = data?.totalRecords || 0;

            return (
              <Card key={param} className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {getParameterLabel(param)}
                  </CardTitle>
                  {getParameterIcon(param)}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? '...' : `${average.toFixed(1)}${getParameterUnit(param)}`}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {loading ? 'Loading...' : `${records} records`}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {parameters.map((param) => {
            const data = settingsData[param];

            return (
              <Card key={param} className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getParameterIcon(param)}
                    {getParameterLabel(param)} - {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} View
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                  ) : data && data.data.length > 0 ? (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        Latest: {data.data[0][param]} {getParameterUnit(param)}
                      </div>
                      <div className="h-32 bg-gray-100 rounded p-2">
                        <div className="text-xs text-gray-500 mb-1">
                          Recent changes ({data.data.length} entries)
                        </div>
                        <div className="flex items-end h-20 gap-1">
                          {data.data.slice(0, 10).reverse().map((entry, index) => {
                            const value = parseFloat(entry[param] || '0');
                            const maxValue = param === 'temperature' ? 35 : 100;
                            const height = (value / maxValue) * 100;

                            return (
                              <div
                                key={index}
                                className="bg-green-500 rounded-sm flex-1 min-w-2"
                                style={{ height: `${height}%` }}
                                title={`${value} ${getParameterUnit(param)}`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-gray-500">
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
