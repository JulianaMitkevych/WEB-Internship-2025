'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApi } from '@/hooks/useApi';

type UpdateSettingsResponse = {
  message: string;
  settings: any;
};

export default function LightSettingsPage() {
  const router = useRouter();
  const { post } = useApi<UpdateSettingsResponse>();
  const [lightValue, setLightValue] = useState<number>(50);

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
          <h1 className="text-xl font-bold text-[#323232]">Light Settings</h1>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="text-center">
            <Lightbulb className="size-12 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-lg font-semibold mb-2">Light Intensity</h2>
            <p className="text-gray-600 text-sm">
              Set the optimal light intensity for your plants
            </p>
          </div>

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
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Recommended Settings</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Microgreens: 70-90%</li>
                <li>• Herbs: 60-80%</li>
                <li>• Vegetables: 50-70%</li>
                <li>• Mushrooms: 20-40%</li>
                <li>• Flowers: 80-100%</li>
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
