'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useStorage } from '@/hooks/useStorage';
import { useApi } from '@/hooks/useApi';
import { ROUTES } from '@/utils/constants';

type UpdateSettingsResponse = {
  message: string;
  settings: any;
};

export default function SettingsPage() {
  const router = useRouter();
  const [store] = useStorage();
  const { post } = useApi<UpdateSettingsResponse>();

  // Initialize toggle states - in a real app, these would come from API
  const [wateringEnabled, setWateringEnabled] = useState<boolean>(true);
  const [ventEnabled, setVentEnabled] = useState<boolean>(true);

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
            <div className="w-full text-left p-3 rounded-lg border bg-gray-50">
              <div className="font-medium">Light Settings</div>
              <div className="text-sm text-gray-600">Configure lighting schedule</div>
            </div>

            <div className="w-full text-left p-3 rounded-lg border bg-gray-50">
              <div className="font-medium">Temperature Settings</div>
              <div className="text-sm text-gray-600">Set temperature range</div>
            </div>

            <div className="w-full text-left p-3 rounded-lg border bg-gray-50">
              <div className="font-medium">Humidity Settings</div>
              <div className="text-sm text-gray-600">Configure humidity levels</div>
            </div>

            <div className="w-full text-left p-3 rounded-lg border bg-gray-50">
              <div className="font-medium">Nutrition Settings</div>
              <div className="text-sm text-gray-600">Manage nutrient delivery</div>
            </div>

            <div className="w-full text-left p-3 rounded-lg border bg-gray-50">
              <div className="font-medium">Watering Settings</div>
              <div className="text-sm text-gray-600">Set watering schedule</div>
            </div>

            <div className="w-full text-left p-3 rounded-lg border bg-gray-50">
              <div className="font-medium">Ventilation Settings</div>
              <div className="text-sm text-gray-600">Configure air circulation</div>
            </div>
          </div>

          {/* Toggle Switches for Watering and Vent */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div>
                <div className="font-medium">Watering System</div>
                <div className="text-sm text-gray-600">Enable/disable automatic watering</div>
              </div>
              <Switch
                checked={wateringEnabled}
                onCheckedChange={setWateringEnabled}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div>
                <div className="font-medium">Ventilation System</div>
                <div className="text-sm text-gray-600">Enable/disable ventilation</div>
              </div>
              <Switch
                checked={ventEnabled}
                onCheckedChange={setVentEnabled}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
