'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApi } from '@/hooks/useApi';

type UpdateSettingsResponse = {
  message: string;
  settings: any;
};

export default function TemperatureSettingsPage() {
  const router = useRouter();
  const { post } = useApi<UpdateSettingsResponse>();
  const [tempValue, setTempValue] = useState<number>(22);

  const handleSave = async () => {
    try {
      await post('/api/settings/update', {
        temperature: tempValue.toString(),
      });
      router.back();
    } catch (err) {
      console.error('Failed to save temperature settings:', err);
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
          <h1 className="text-xl font-bold text-[#323232]">Temperature Settings</h1>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="text-center">
            <Thermometer className="size-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-lg font-semibold mb-2">Temperature Control</h2>
            <p className="text-gray-600 text-sm">
              Set the optimal temperature range for your plants
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature: {tempValue}°C
              </label>
              <input
                type="range"
                min="10"
                max="35"
                value={tempValue}
                onChange={(e) => setTempValue(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10°C</span>
                <span>35°C</span>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-medium text-orange-900 mb-2">Recommended Settings</h3>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• Microgreens: 18-22°C</li>
                <li>• Herbs: 20-25°C</li>
                <li>• Vegetables: 18-24°C</li>
                <li>• Mushrooms: 15-20°C</li>
                <li>• Flowers: 20-28°C</li>
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
