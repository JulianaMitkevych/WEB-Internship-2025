'use client';

import { useRouter } from 'next/navigation';
import { useStorage } from '@/hooks/useStorage';
import { useTheme } from '@/hooks/useTheme';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ROUTES } from '@/utils/constants';
import { useCurrentValues } from '@/hooks/useCurrentValues';
import { useSettings } from '@/hooks/useSettings';

import LightIcon from '@/assets/svg/LightIcon';
import TempIcon from '@/assets/svg/TempIcon';
import NutritionIcon from '@/assets/svg/NutritionIcon';
import HumidityIcon from '@/assets/svg/HumidityIcon';
import VentIcon from '@/assets/svg/VentIcon';
import WaterIcon from '@/assets/svg/WaterIcon';

import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { Switch } from '@/components/ui/switch';

const DashboardContent = () => {
  const router = useRouter();
  const [store] = useStorage();
  const { currentValues, loading: valuesLoading } = useCurrentValues();
  const { settings, updateSettings } = useSettings();
  const { classes: themeClasses } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentDay = store.user?.growthDay || 12;
  const totalDays = store.user?.totalGrowthDays || 21;
  const progressPercentage = Math.min((currentDay / totalDays) * 100, 100);

  const parameters = [
    'Light',
    'Temperature',
    'Humidity',
    'Nutrition',
    'Vent',
    'Watering',
  ];

  const getIsActive = (param: string) => {
    const key = param.toLowerCase();
    if (!settings || !settings[key]) return false;
    return typeof settings[key] === 'object' ? settings[key].isEnabled : true;
  };

  const handleToggle = (param: string, checked: boolean) => {
    const key = param.toLowerCase();
    const currentValue =
      typeof settings?.[key] === 'object'
        ? settings[key].value
        : currentValues?.[key]?.toString() || '0';

    updateSettings({
      [key]: { isEnabled: checked, value: currentValue },
    });
  };

  const getParameterIcon = (param: string) => {
    switch (param) {
      case 'Light':
        return <LightIcon />;
      case 'Temperature':
        return <TempIcon />;
      case 'Humidity':
        return <HumidityIcon />;
      case 'Nutrition':
        return <NutritionIcon />;
      case 'Vent':
        return <VentIcon />;
      case 'Watering':
        return <WaterIcon />;
      default:
        return null;
    }
  };

  return (
    <div className={`h-screen ${themeClasses.background} flex flex-col max-w-[768px] mx-auto`}>
      {/* Plant Info Section */}
      <div className=" p-[20px]  flex flex-col items-center">
        <div className="w-[148px] h-[148px] md:w-[168px] md:h-[168px] relative rounded-full border-2 border-[#53C904] p-1 overflow-hidden">
          <Image
            src="/images/green.png"
            alt="Plant"
            fill
            sizes="sizes=(max-width: 768px) 148px, 158px"
            priority
            className="object-cover"
          />
        </div>
        <h1 className="text-[24px] p-[10px] font-bold text-black ">
          {mounted ? store.user?.cropType || 'Microgreens' : 'Microgreens'}
        </h1>

        <div className="w-full mt-[10px] px-4 flex flex-col items-center">
          <div className="relative w-[196px] sm:w-[450px] h-[8px] bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 bg-[#53C904] h-[8px] transition-all duration-1000 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 px-1">
            <span className="text-[#53C904] font-bold text-sm">
              {currentDay}
              <span className="text-gray-300 font-medium ml-1">
                /{totalDays} days
              </span>
            </span>
            <span className="text-gray-400 text-sm font-medium">
              ({totalDays - currentDay} days till harvest)
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 sm:px-8 mb-[38px]">
        <div className="grid grid-cols-2 gap-4">
          {parameters.map((param) => {
            const key = param.toLowerCase();
            const realValue = currentValues?.[key];
            const hasData = realValue !== undefined && realValue !== null;
            const isSwitchable = param === 'Vent' || param === 'Watering';

            return (
              <div
                key={param}
                className={`${themeClasses.cardBackground} p-[12px] md:p-[14px] rounded-[12px] ${themeClasses.shadow} ${themeClasses.border} flex flex-col justify-between h-[107px] md:h-[118px] w-full sm:w-[280px] mx-auto cursor-pointer`}
                onClick={() =>
                  router.push(
                    ROUTES.PLANT_SETTINGS[param.toUpperCase() as any] ||
                      ROUTES.SETTINGS
                  )
                }
              >
                <div className="text-[#53C904] size-6 flex items-center justify-center mb-2">
                  {getParameterIcon(param)}
                </div>

                <div className="flex flex-col mt-auto">
                  {!isSwitchable && (
                    <span
                      className={`text-[24px] font-bold leading-tight ${
                        hasData ? 'text-black' : 'text-gray-300'
                      }`}
                    >
                      {valuesLoading
                        ? '...'
                        : hasData
                          ? `${realValue}${param === 'Temperature' ? '°C' : '%'}`
                          : 'No data'}
                    </span>
                  )}

                  {isSwitchable && (
                    <div
                      className="mb-2 h-6 flex items-center"
                      onClick={(e) => e.stopPropagation()} // Зупиняємо перехід по картці
                    >
                      <Switch
                        checked={getIsActive(param)}
                        onCheckedChange={(checked) =>
                          handleToggle(param, checked)
                        }
                        className="w-10 h-6 data-[state=checked]:bg-[#53C904]"
                      />
                    </div>
                  )}

                  <span className="text-black font-semibold text-[16px] md:text-[18px]">
                    {param}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={themeClasses.background}>
        <BottomNavigation activeTab="home" />
      </div>
    </div>
  );
};

export default DashboardContent;
