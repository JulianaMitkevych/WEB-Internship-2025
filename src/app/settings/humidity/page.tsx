'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApi } from '@/hooks/useApi';

type UpdateSettingsResponse = {
  message: string;
  settings: any;
};

export default function HumiditySettingsPage() {
  const router = useRouter();
  const { post } = useApi<UpdateSettingsResponse>();
  const [humidityValue, setHumidityValue] = useState<number>(60);

  const handleSave = async () => {
    try {
      await post('/api/settings/update', {
        humidity: humidityValue.toString(),
      });
      router.back();
    } catch (err) {
      console.error('Failed to save humidity settings:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="sm"
            className="px-3 py-2"
          >
            <ChevronLeft className="size-4 mr-1" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-[#323232]">Humidity Settings</h1>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="text-center">
            <Droplets className="size-12 mx-auto text-blue-500 mb-4" />
            <h2 className="text-lg font-semibold mb-2">Humidity Control</h2>
            <p className="text-gray-600 text-sm">
              Set the optimal humidity level for your plants
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Humidity: {humidityValue}%
              </label>
              <input
                type="range"
                min="30"
                max="90"
                value={humidityValue}
                onChange={(e) => setHumidityValue(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>30%</span>
                <span>90%</span>
              </div>
            </div>

            <div className="bg-cyan-50 p-4 rounded-lg">
              <h3 className="font-medium text-cyan-900 mb-2">Recommended Settings</h3>
              <ul className="text-sm text-cyan-800 space-y-1">
                <li>• Microgreens: 60-70%</li>
                <li>• Herbs: 50-65%</li>
                <li>• Vegetables: 55-75%</li>
                <li>• Mushrooms: 85-95%</li>
                <li>• Flowers: 50-70%</li>
              </ul>
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
  );
}
