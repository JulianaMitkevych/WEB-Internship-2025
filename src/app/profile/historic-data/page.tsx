'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/utils/constants';
import { useTheme } from '@/hooks/useTheme';
import LightIcon from '@/assets/svg/LightIcon';
import TempIcon from '@/assets/svg/TempIcon';
import NutritionIcon from '@/assets/svg/NutritionIcon';
import HumidityIcon from '@/assets/svg/HumidityIcon';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { ChevronLeft } from 'lucide-react';

const HistoricDataPage = () => {
  const router = useRouter();
  const { classes: themeClasses, isDark } = useTheme();

  const parameters = [
    {
      name: 'Light',
      icon: <LightIcon className={isDark ? 'text-[#FFFFFF]' : ''} />,
      route: ROUTES.HISTORIC_DATA_PARAMS.LIGHT,
    },
    {
      name: 'Temperature',
      icon: (
        <TempIcon
          className={`size-8 sm:size-10 ${isDark ? 'text-[#FFFFFF]' : ''}`}
        />
      ),
      route: ROUTES.HISTORIC_DATA_PARAMS.TEMPERATURE,
    },
    {
      name: 'Humidity',
      icon: (
        <HumidityIcon
          className={`sm:size-9 ${isDark ? 'text-[#FFFFFF]' : ''}`}
        />
      ),
      route: ROUTES.HISTORIC_DATA_PARAMS.HUMIDITY,
    },
    {
      name: 'Nutrition',
      icon: (
        <NutritionIcon
          className={`sm:size-8 ${isDark ? 'text-[#FFFFFF]' : ''}`}
        />
      ),
      route: ROUTES.HISTORIC_DATA_PARAMS.NUTRITION,
    },
  ];

  return (
    <div
      className={`h-screen ${themeClasses.background} flex flex-col max-w-[768px] mx-auto`}
    >
      {/* Header */}
      <div className="flex items-center px-4 py-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-transparent hover:opacity-70 transition-opacity active:scale-95"
        >
          <ChevronLeft className={`w-6 h-6 ${themeClasses.textPrimary}`} />
        </button>
        <h1
          className={`text-[24px] font-bold ${themeClasses.textPrimary} ml-2`}
        >
          Historic Data
        </h1>
      </div>

      {/* Grid Content */}
      <div className="px-4 py-3 sm:px-16 flex-1 ">
        <div className="grid grid-cols-2 gap-4">
          {parameters.map((param) => (
            <div
              key={param.name}
              onClick={() => router.push(param.route)}
              className={`${themeClasses.cardBackground} p-[14px] sm:p-[20px] rounded-[12px] ${themeClasses.shadow} ${themeClasses.border} flex flex-col justify-between h-[95px] sm:h-[120px] w-full cursor-pointer active:scale-95 transition-transform`}
            >
              <div className="text-[#53C904] flex items-start  w-[34px] h-[34px]  sm:w-[42px] sm:h-[42px] justify-start">
                <div className="flex w-full items-center justify-center">
                  {param.icon}
                </div>
              </div>

              <div className="flex flex-col mt-auto">
                <span
                  className={`${themeClasses.textPrimary} text-[16px] font-semibold md:text-[18px] sm:font-bold text-left`}
                >
                  {param.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <BottomNavigation activeTab="profile" />
    </div>
  );
};

export default HistoricDataPage;
