'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { useSettings } from '@/hooks/useSettings';
import { useApi } from './../../hooks/useApi';

import TempIcon from '@/assets/svg/TempIcon';
import HumidityIcon from '@/assets/svg/HumidityIcon';
import WaterIcon from '@/assets/svg/WaterIcon';
import VentIcon from '@/assets/svg/VentIcon';
import NutritionIcon from '@/assets/svg/NutritionIcon';
import LightIcon from '@/assets/svg/LightIcon';

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings, isLoading } = useSettings();
  const { post: apiPost } = useApi();
  const [lightValue, setLightValue] = useState<number>(8);
  const [temperatureValue, setTemperatureValue] = useState<number>(24);
  const [humidityValue, setHumidityValue] = useState<number>(50);
  const [nutritionValue, setNutritionValue] = useState<number>(250);
  const [wateringValue, setWateringValue] = useState<number>(250);
  const [ventValue, setVentValue] = useState<number>(12);

  const [ventEnabled, setVentEnabled] = useState<boolean>(true);
  const [lightEnabled, setLightEnabled] = useState<boolean>(true);

  // FUNCTION DATA GENERATION__________________________________

 const generateMonthlyStats = async () => {
   try {
     const stats = [];
     const now = new Date(); // date today

     for (let i = 30; i >= 0; i--) {
       // add data for past 30 days including today
       const currentDate = new Date(now.getTime());
       //past 2025 December and today 2026 January
       currentDate.setDate(now.getDate() - i);

       if (i === 0) {
         //today: 2026 January - 4 dot per day
         for (let hour = 0; hour < 24; hour += 6) {
           const hourlyPoint = new Date(currentDate.getTime());
           hourlyPoint.setHours(hour, 0, 0, 0);

           stats.push({
             date: hourlyPoint.toISOString().split('T')[0], // YYYY-MM-DD
             timestamp: hourlyPoint.getTime(),
             temperature: parseFloat((22 + Math.random() * 5).toFixed(1)),
             humidity: Math.floor(40 + Math.random() * 20),
             light: Math.floor(50 + Math.random() * 40),
             nutrition: Math.floor(200 + Math.random() * 100),
             watering: Math.floor(150 + Math.random() * 150),
             vent: Math.floor(10 + Math.random() * 10),
           });
         }
       } else {
         // other days: 2025 December - 1 dot per day
         currentDate.setHours(12, 0, 0, 0);
         stats.push({
           date: currentDate.toISOString().split('T')[0],
           timestamp: currentDate.getTime(), // number (ms)
           temperature: parseFloat((22 + Math.random() * 5).toFixed(1)),
           humidity: Math.floor(40 + Math.random() * 20),
           light: Math.floor(50 + Math.random() * 40),
           nutrition: Math.floor(200 + Math.random() * 100),
           watering: Math.floor(150 + Math.random() * 150),
           vent: Math.floor(10 + Math.random() * 10),
         });
       }
     }

     // Sort by timestamp ascending
     const sortedStats = stats.sort((a, b) => a.timestamp - b.timestamp);

     await apiPost('/api/settings/history', { monthlyStats: sortedStats });
  // eslint-disable-next-line no-alert
     alert('Success! Data for Dec 2025 - Jan 2026 generated correctly.');
   } catch (error) {
     console.error('Firebase Error:', error);
     // eslint-disable-next-line no-alert
     alert('Error saving data.');
   }
 };
  // FUNCTION ENDS _______________________________________

  useEffect(() => {
    if (settings) {
      const getVal = (field: any) =>
        field && typeof field === 'object' ? field.value : field;
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
      labels: ['10`C', '24`C', '36`C'],
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
      className={`h-screen max-w-[768px] mx-auto  flex flex-col pb-24 ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
    >
      <div className="p-6">
        <h1 className="text-[24px] sm:text-[28px] font-bold text-center text-black">
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
                <item.icon className="w-6 h-6 text-[#2F7302]" />
                <span className="font-bold text-black">{item.title}</span>
              </div>
              {item.hasSwitch && (
                <Switch
                  checked={item.enabled}
                  onCheckedChange={(checked) => {
                    item.setEnabled?.(checked);
                    updateSettings({
                      [item.id]: {
                        isEnabled: checked,
                        value: item.val.toString(),
                      },
                    });
                  }}
                  className="data-[state=checked]:bg-[#53C904]"
                />
              )}
            </div>
            <div className="px-1">
              <Slider
                value={[item.val]}
                onValueChange={(v) => item.setVal(v[0])}
                onValueCommit={(v) => {
                  const valStr = v[0].toString();
                  const payload = item.hasSwitch
                    ? { [item.id]: { isEnabled: item.enabled, value: valStr } }
                    : { [item.id]: valStr };
                  updateSettings(payload);
                }}
                max={item.max}
                min={item.min}
                step={1}
                className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-[#2F7302]"
              />
              <div className="flex justify-between mt-2">
                {item.labels.map((lbl) => (
                  <span
                    key={lbl}
                    className="text-[10px] text-[#90949D] mt-[5px]  font-medium"
                  >
                    {lbl}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* --- DELETE THIS BUTTON START --- */}
        <div className="mt-8 pt-4 border-t border-dashed border-gray-200">
          <button
            onClick={generateMonthlyStats}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            📊 Generate Monthly Data
          </button>
        </div>
        {/* --- DELETE THIS BUTTON END --- */}
      </div>

      <BottomNavigation activeTab="settings" />
    </div>
  );
}
