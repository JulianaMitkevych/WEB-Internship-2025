'use client';

import { useRouter } from 'next/navigation';
import { useStorage } from '@/hooks/useStorage';
import { useTheme } from '@/hooks/useTheme';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ROUTES } from '@/utils/constants';
import { useCurrentValues } from '@/hooks/useCurrentValues';
import { useSettings } from '@/hooks/useSettings';
import { useHarvestStatus } from '@/hooks/useHarvestStatus';
import { EGrowthStatus } from '@/types/types';
import { differenceInDays, format, addDays } from 'date-fns';
import { CalendarCog } from 'lucide-react';
import { Calendar1 } from 'lucide-react';

import LightIcon from '@/assets/svg/LightIcon';
import TempIcon from '@/assets/svg/TempIcon';
import NutritionIcon from '@/assets/svg/NutritionIcon';
import HumidityIcon from '@/assets/svg/HumidityIcon';
import VentIcon from '@/assets/svg/VentIcon';
import WaterIcon from '@/assets/svg/WaterIcon';

import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const DashboardContent = () => {
  const router = useRouter();
  const [store] = useStorage();
  const { currentValues, loading: valuesLoading } = useCurrentValues();
  const { settings, updateSettings } = useSettings();
  const { classes: themeClasses } = useTheme();
  const { checkHarvestStatus } = useHarvestStatus();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Розрахунок днів вирощування на основі реальних дат
  const calculateGrowthData = () => {
    if (!store.user?.startDate || !store.user?.expectedDays) {
      return {
        currentDay: 0,
        totalDays: store.user?.expectedDays || 21,
        progressPercentage: 0,
        isSetupMode: true,
      };
    }

    const startDate = new Date(store.user.startDate);
    const now = new Date();

    // Якщо вибрана дата старту в майбутньому - вирощування ще не почалося
    const isFutureStart = now < startDate;
    const currentDay = isFutureStart
      ? 0 // вирощування ще не почалося
      : Math.max(1, differenceInDays(now, startDate) + 1); // звичайний розрахунок

    const totalDays = store.user.expectedDays;
    const progressPercentage = isFutureStart
      ? 0 // якщо ще не почалося, прогрес = 0
      : Math.min((currentDay / totalDays) * 100, 100);

    return {
      currentDay,
      totalDays,
      progressPercentage,
      isSetupMode: false,
    };
  };

  const { currentDay, totalDays, progressPercentage, isSetupMode } =
    calculateGrowthData();

  // Перевіряємо, чи вирощування ще не почалося
  const startDate = store.user?.startDate
    ? new Date(store.user.startDate)
    : null;
  const now = new Date();
  const isFutureStart = startDate && now < startDate;

  // Перевірка статусу збору врожаю при завантаженні
  useEffect(() => {
    if (store.user?.status === EGrowthStatus.GROWING && !isSetupMode) {
      checkHarvestStatus();
    }
  }, [store.user?.status, isSetupMode]);

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
    <div
      className={`min-h-screen ${themeClasses.background} flex flex-col max-w-[768px] mx-auto`}
    >
      {/* Plant Info Section */}
      <div className=" p-[20px]  flex flex-col items-center">
        <div className="w-[148px] h-[148px] ms:w-[168px] ms:h-[168px] relative rounded-full border-2 border-[#53C904] p-1 overflow-hidden">
          <Image
            src="/images/green.png"
            alt="Plant"
            fill
            sizes="sizes=(max-width: 768px) 148px, 158px"
            priority
            className="object-cover"
          />
        </div>
        <h1
          className={`text-[24px] p-[10px] font-bold ${themeClasses.textPrimary} `}
        >
          {mounted ? store.user?.cropType || 'Microgreens' : 'Microgreens'}
        </h1>

        <div className="w-full mt-[10px] px-4 flex flex-col items-center">
          {isSetupMode ? (
            // button date
            <div className="text-center py-8">
              <h3
                className={`text-lg font-semibold ${themeClasses.textPrimary} mb-2 flex items-center justify-center gap-2`}
              >
                Set Growth Period
                <Calendar1 className="w-5 h-5 text-gray-400" />
              </h3>
              <p className="text-gray-600 text-sm mb-6 max-w-xs">
                Choose when to start growing your plants
              </p>
              <Button
                onClick={() => router.push(ROUTES.SET_GROWTH_DATE)}
                variant="gradient"
                className="px-6 py-3"
              >
                Set Growth Date
              </Button>
            </div>
          ) : (
            // progress bar
            <>
              <div className="relative w-[196px] sm:w-[450px] h-[8px] bg-[#D5E3CC] rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 bg-gradient-to-b from-[#53C904] to-[#2F7302] h-[8px]  sm:h-[10px]  transition-all duration-1000 ease-out rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 px-1 w-full max-w-[450px]">
                <span className="text-[#53C904] font-bold text-sm">
                  {isFutureStart ? 'Not started' : `Day ${currentDay}`}
                  <span className="text-gray-400 font-medium ml-1">
                    /{totalDays}
                  </span>
                </span>
                <span className="text-gray-400 text-sm font-medium">
                  {store.user?.status === EGrowthStatus.HARVEST
                    ? 'Ready for harvest!'
                    : isFutureStart
                      ? `Starts in ${Math.ceil((startDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} days`
                      : `${Math.max(0, totalDays - currentDay)} days left`}
                </span>
              </div>

              {/* info date */}
              {store.user?.startDate && (
                <div className="mt-3 text-center">
                  <p className="text-xs text-gray-500">
                    {isFutureStart ? 'Starts:' : 'Started:'}{' '}
                    {format(new Date(store.user.startDate), 'MMM dd, yyyy')}
                  </p>
                  {store.user.expectedDays && (
                    <p className="text-xs text-gray-500">
                      Expected harvest:{' '}
                      {format(
                        addDays(
                          new Date(store.user.startDate),
                          store.user.expectedDays
                        ),
                        'MMM dd, yyyy'
                      )}
                    </p>
                  )}
                </div>
              )}

              {/* button change date */}
              <Button
                onClick={() => router.push(ROUTES.SET_GROWTH_DATE)}
                variant="gradient"
                size="sm"
                className="mt-3 text-xs rounded-[12px]  bg-gradient-to-b from-[#53C904] to-[#2F7302]
                   hover:from-[#2F7302] hover:to-[#53C904]
                   focus:from-[#2F7302] focus:to-[#53C904]"
              >
                <CalendarCog className="w-3 h-3 mr-1 " />
                Change Growth Period
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="px-4 py-2  sm:px-16  mb-[38px]">
        <div className="grid grid-cols-2 gap-4">
          {parameters.map((param) => {
            const key = param.toLowerCase();
            const realValue = currentValues?.[key];
            const hasData = realValue !== undefined && realValue !== null;
            const isSwitchable = param === 'Vent' || param === 'Watering';

            return (
              <div
                key={param}
                className={`${themeClasses.cardBackground} p-[12px]  sm:px-[20px] rounded-[12px] ${themeClasses.shadow} ${themeClasses.border} flex flex-col justify-between h-[107px] sm:h-[118px] w-full sm:w-[280px] mx-auto cursor-pointer`}
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
                        hasData ? 'text-[#53c904]' : 'text-[#53C904]'
                      }`}
                    >
                      {valuesLoading
                        ? '...'
                        : hasData
                          ? `${realValue}${param === 'Temperature' ? '`C' : '%'}`
                          : 'No data'}
                    </span>
                  )}

                  {isSwitchable && (
                    <div
                      className="mb-2 h-6 flex items-center"
                      onClick={(e) => e.stopPropagation()} // stop
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

                  <span
                    className={`${themeClasses.textPrimary} font-semibold text-[16px] md:text-[18px]`}
                  >
                    {param}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNavigation activeTab="home" />
    </div>
  );
};

export default DashboardContent;
