'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { useSettings } from '@/hooks/useSettings';

import TempIcon from '@/assets/svg/TempIcon';
import HumidityIcon from '@/assets/svg/HumidityIcon';
import WaterIcon from '@/assets/svg/WaterIcon';
import VentIcon from '@/assets/svg/VentIcon';
import NutritionIcon from '@/assets/svg/NutritionIcon';
import LightIcon from '@/assets/svg/LightIcon';

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings, isLoading } = useSettings();

  // 1.local state for each setting
  const [lightValue, setLightValue] = useState<number>(8);
  const [temperatureValue, setTemperatureValue] = useState<number>(24);
  const [humidityValue, setHumidityValue] = useState<number>(50);
  const [nutritionValue, setNutritionValue] = useState<number>(250);
  const [wateringValue, setWateringValue] = useState<number>(250);
  const [ventValue, setVentValue] = useState<number>(12);

  const [ventEnabled, setVentEnabled] = useState<boolean>(true);
  const [lightEnabled, setLightEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (settings) {
      // function to get value from fiels which can be string or object
      const getVal = (field: any) =>
        field && typeof field === 'object' ? field.value : field;

      // function to get isEnabled of default true
      const getEnabled = (field: any) =>
        field && typeof field === 'object' ? (field.isEnabled ?? true) : true;

      setLightValue(parseInt(getVal(settings.light)) || 8);
      setLightEnabled(getEnabled(settings.light));

      setVentValue(parseInt(getVal(settings.vent)) || 12);
      setVentEnabled(getEnabled(settings.vent));

      setTemperatureValue(parseInt(getVal(settings.temperature)) || 24);
      setHumidityValue(parseInt(getVal(settings.humidity)) || 50);
      setNutritionValue(parseInt(getVal(settings.nutrition)) || 250);
      setWateringValue(parseInt(getVal(settings.watering)) || 250);
    }
  }, [settings]);
  // config array to map
  const config = [
    {
      id: 'vent',
      title: 'Vent',
      icon: VentIcon,
      val: ventValue,
      setVal: setVentValue,
      min: 1,
      max: 24,
      labels: ['1h', '12h', '24h'],
      hasSwitch: true,
      enabled: ventEnabled,
      setEnabled: setVentEnabled,
    },
    {
      id: 'light',
      title: 'Lightening',
      icon: LightIcon,
      val: lightValue,
      setVal: setLightValue,
      min: 1,
      max: 16,
      labels: ['1h', '8h', '16h'],
      hasSwitch: true,
      enabled: lightEnabled,
      setEnabled: setLightEnabled,
    },
    {
      id: 'temperature',
      title: 'Temperature',
      icon: TempIcon,
      val: temperatureValue,
      setVal: setTemperatureValue,
      min: 10,
      max: 36,
      labels: ['10°C', '24°C', '36°C'],
    },
    {
      id: 'humidity',
      title: 'Humidity',
      icon: HumidityIcon,
      val: humidityValue,
      setVal: setHumidityValue,
      min: 0,
      max: 100,
      labels: ['Off', '50%', '100%'],
    },
    {
      id: 'nutrition',
      title: 'Nutrition',
      icon: NutritionIcon,
      val: nutritionValue,
      setVal: setNutritionValue,
      min: 0,
      max: 500,
      labels: ['Off', '250mg', '500mg'],
    },
    {
      id: 'watering',
      title: 'Watering',
      icon: WaterIcon,
      val: wateringValue,
      setVal: setWateringValue,
      min: 0,
      max: 500,
      labels: ['Off', '250mg', '500mg'],
    },
  ];

  return (
    <div
      className={`min-h-screen bg-gray-50 flex flex-col pb-24 ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
    >
      <div className="p-6">
        <h1 className="text-xl font-bold text-center text-gray-900">
          Settings
        </h1>
      </div>

      <div className="flex-1 px-4 space-y-4 max-w-md mx-auto w-full">
        {config.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => router.push(`/settings/${item.id}`)}
              >
                <item.icon className="w-6 h-6 text-green-700" />
                <span className="font-bold text-gray-800">{item.title}</span>
              </div>

              {item.hasSwitch && (
                <Switch
                  checked={item.enabled}
                  onCheckedChange={(checked) => {
                    item.setEnabled?.(checked);
                    // (Toggle)
                    updateSettings({
                      [item.id]: {
                        isEnabled: checked,
                        value: item.val.toString(),
                      },
                    });
                  }}
                  className="data-[state=checked]:bg-green-500"
                />
              )}
            </div>

            <div className="px-1">
              {/* independent  slider values and setters */}
              <Slider
                value={[item.val]}
                onValueChange={(v) => item.setVal(v[0])}
                onValueCommit={(v) => {
                  const valStr = v[0].toString();
                  const payload = item.hasSwitch
                    ? { [item.id]: { isEnabled: item.enabled, value: valStr } }
                    : { [item.id]: valStr };
                  //(Commit)
                  updateSettings(payload);
                }}
                max={item.max}
                min={item.min}
                step={1}
                className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-green-500"
              />
              <div className="flex justify-between mt-2">
                {item.labels.map((lbl) => (
                  <span
                    key={lbl}
                    className="text-[10px] text-gray-400 font-medium"
                  >
                    {lbl}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNavigation activeTab="settings" />
    </div>
  );
}
