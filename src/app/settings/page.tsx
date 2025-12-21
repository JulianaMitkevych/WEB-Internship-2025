'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/utils/constants';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[#323232]">Settings</h1>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="px-4 py-2"
          >
            Back
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-2">Plant Settings</h2>
            <p className="text-gray-600 text-sm">
              Configure your plant growing parameters
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push(ROUTES.PLANT_SETTINGS.LIGHT)}
              className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Light Settings</div>
              <div className="text-sm text-gray-600">Configure lighting schedule</div>
            </button>

            <button
              onClick={() => router.push(ROUTES.PLANT_SETTINGS.TEMPERATURE)}
              className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Temperature Settings</div>
              <div className="text-sm text-gray-600">Set temperature range</div>
            </button>

            <button
              onClick={() => router.push(ROUTES.PLANT_SETTINGS.HUMIDITY)}
              className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Humidity Settings</div>
              <div className="text-sm text-gray-600">Configure humidity levels</div>
            </button>

            <button
              onClick={() => router.push(ROUTES.PLANT_SETTINGS.NUTRITION)}
              className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Nutrition Settings</div>
              <div className="text-sm text-gray-600">Manage nutrient delivery</div>
            </button>

            <button
              onClick={() => router.push(ROUTES.PLANT_SETTINGS.WATERING)}
              className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Watering Settings</div>
              <div className="text-sm text-gray-600">Set watering schedule</div>
            </button>

            <button
              onClick={() => router.push(ROUTES.PLANT_SETTINGS.VENT)}
              className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Ventilation Settings</div>
              <div className="text-sm text-gray-600">Configure air circulation</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
