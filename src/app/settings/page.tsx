'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { useSettings } from '@/hooks/useSettings';
// import { ROUTES } from '@/utils/constants';
import
  TempIcon
 from '@/assets/svg/TempIcon';
import  HumidityIcon  from '@/assets/svg/HumidityIcon';
import  WaterIcon  from '@/assets/svg/WaterIcon';
import  VentIcon from '@/assets/svg/VentIcon';
import NutritionIcon from '@/assets/svg/NutritionIcon';
import  LightIcon  from '@/assets/svg/LightIcon';

// type UpdateSettingsResponse = {
//   message: string;
//   settings: any;
// };

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings, isLoading } = useSettings();

  // Local state for sliders
  const [lightValue, setLightValue] = useState<number>(8);
  const [temperatureValue, setTemperatureValue] = useState<number>(24);
  const [humidityValue, setHumidityValue] = useState<number>(50);
  const [nutritionValue, setNutritionValue] = useState<number>(250);
  const [wateringValue, setWateringValue] = useState<number>(250);
  const [ventValue, setVentValue] = useState<number>(12);
  const [ventEnabled, setVentEnabled] = useState<boolean>(true);
  const [lightEnabled, setLightEnabled] = useState<boolean>(true);

  // Sync with settings when loaded
  useEffect(() => {
    if (settings) {
      setLightValue(parseInt(settings.light) || 8);
      setTemperatureValue(parseInt(settings.temperature) || 24);
      setHumidityValue(parseInt(settings.humidity) || 50);
      setNutritionValue(parseInt(settings.nutrition) || 250);
      setWateringValue(parseInt(settings.watering?.value) || 250);
      setVentValue(parseInt(settings.vent?.value) || 12);
      setVentEnabled(settings.vent?.isEnabled ?? true);
    }
  }, [settings]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">Settings</h1>
          <div className="w-8"></div>

      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            

              {/* Ventilation Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <VentIcon className="w-6 h-6 text-gray-600" />
                <div>
                  <div className="font-medium">Vent</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/settings/vent')}
                className="text-green-600"
              >
                Edit
              </Button>
            </div>
            <div className="flex items-center gap-4 pl-9">
              <div className="flex-1">
                <Slider
                  value={[ventValue]}
                  onValueChange={(value) => setVentValue(value[0])}
                  max={24}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1h</span>
                  <span>12h</span>
                  <span>24h</span>
                </div>
              </div>
              <Switch
                checked={ventEnabled}
                onCheckedChange={setVentEnabled}
              />
            </div>
          </div>


          {/* Light Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LightIcon className="w-6 h-6 text-green-600" />
                <div>
                  <div className="font-medium">Light </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/settings/light')}
                className="text-green-600"
              >
                Edit
              </Button>
            </div>
            <div className="flex items-center gap-4 pl-9">
              <div className="flex-1">
                <Slider
                  value={[lightValue]}
                  onValueChange={(value) => setLightValue(value[0])}
                  max={16}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1h</span>
                  <span>8h</span>
                  <span>16h</span>
                </div>
              </div>
              <Switch
                checked={lightEnabled}
                onCheckedChange={setLightEnabled}
              />
            </div>
          </div>

          {/* Temperature Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TempIcon className="w-6 h-6 text-red-500" />
                <div>
                  <div className="font-medium">Temperature</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/settings/temperature')}
                className="text-green-600"
              >
                Edit
              </Button>
            </div>
            <div className="pl-9">
              <Slider
                value={[temperatureValue]}
                onValueChange={(value) => setTemperatureValue(value[0])}
                max={36}
                min={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10°C</span>
                <span>24°C</span>
                <span>36°C</span>
              </div>
            </div>
          </div>

          {/* Humidity Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HumidityIcon className="w-6 h-6 text-blue-500" />
                <div>
                  <div className="font-medium">Humidity</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/settings/humidity')}
                className="text-green-600"
              >
                Edit
              </Button>
            </div>
            <div className="pl-9">
              <Slider
                value={[humidityValue]}
                onValueChange={(value) => setHumidityValue(value[0])}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Off</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Nutrition Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <NutritionIcon className="w-6 h-6 text-purple-500" />
                <div>
                  <div className="font-medium">Nutrition </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/settings/nutrition')}
                className="text-green-600"
              >
                Edit
              </Button>
            </div>
            <div className="pl-9">
              <Slider
                value={[nutritionValue]}
                onValueChange={(value) => setNutritionValue(value[0])}
                max={500}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Off</span>
                <span>250mg</span>
                <span>500mg</span>
              </div>
            </div>
          </div>

          {/* Watering Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <WaterIcon className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="font-medium">Watering </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/settings/watering')}
                className="text-green-600"
              >
                Edit
              </Button>
            </div>
            <div className="pl-9">
              <Slider
                value={[wateringValue]}
                onValueChange={(value) => setWateringValue(value[0])}
                max={500}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Off</span>
                <span>250mg</span>
                <span>500mg</span>
              </div>
            </div>
          </div>

        

          {/* Save Button */}
          <div className="border-t pt-4">
            <Button
              onClick={async () => {
                try {
                  await updateSettings({
                    light: lightValue.toString(),
                    temperature: temperatureValue.toString(),
                    humidity: humidityValue.toString(),
                    nutrition: nutritionValue.toString(),
                    vent: {
                      isEnabled: ventEnabled,
                      value: ventValue.toString(),
                    },
                    watering: {
                      isEnabled: true,
                      value: wateringValue.toString(),
                    },
                  });
                } catch (error) {
                  console.error('Failed to save settings:', error);
                }
              }}
              disabled={isLoading}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg"
            >
              {isLoading ? 'Saving...' : 'Save All Settings'}
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
