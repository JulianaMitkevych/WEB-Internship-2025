
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStorage } from '@/hooks/useStorage';
import { useTheme } from '@/hooks/useTheme';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { ChevronLeft } from 'lucide-react';
import { ROUTES } from '@/utils/constants';
import { Button } from '@/components/ui/button';
import { differenceInDays } from 'date-fns';
import { EGrowthStatus } from '@/types/types';

export default function ChangeCropTypeIntermediatePage() {
  const [store] = useStorage();
  const { classes: theme, mounted: themeMounted } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cropType = store.user?.cropType || 'Microgreens';

  const calculateGrowthData = () => {
    if (!store.user?.startDate || !store.user?.expectedDays) {
      return {
        currentDay: 0,
        totalDays: store.user?.expectedDays || 21,
        progressPercentage: 0,
        isSetupMode: true,
        isHarvestDay: false,
      };
    }

    const startDate = new Date(store.user.startDate);
    const now = new Date();
    const isFutureStart = now < startDate;
    const currentDay = isFutureStart
      ? 0
      : Math.max(1, differenceInDays(now, startDate) + 1);

    const totalDays = store.user.expectedDays;
    const progressPercentage = isFutureStart
      ? 0
      : Math.min((currentDay / totalDays) * 100, 100);
    const isHarvestDay = !isFutureStart && currentDay >= totalDays;

    return {
      currentDay,
      totalDays,
      progressPercentage,
      isSetupMode: false,
      isHarvestDay,
    };
  };

  const {
    currentDay,
    totalDays,
    progressPercentage,
    isSetupMode,
    isHarvestDay,
  } = calculateGrowthData();

  const canChangeCropType = () => {
    if (!store.user?.cropType) return false;
    return (
      isSetupMode || isHarvestDay || store.user.status === EGrowthStatus.HARVEST
    );
  };

  const handleChangeCropType = () => {
    if (canChangeCropType()) {
      router.push(ROUTES.CHANGE_CROP_TYPE);
    }
  };

  if (!mounted || !themeMounted) return null;

  return (
    <div
      className={`min-h-screen ${theme.background} flex flex-col max-w-[768px] mx-auto transition-colors duration-300`}
    >
      <div className="w-full py-6 px-5 sm:px-6 mt-4 flex items-center gap:3 sm:gap-4">
        <button
          onClick={() => router.back()}
          className="p-1 flex-shrink-0 rounded-full transition-all hover:bg-white/10"
        >
          <ChevronLeft className={`w-8 h-8 ${theme.textPrimary}`} />
        </button>
        <h1
          className={`text-[24px] sm:text-[26px] font-bold ${theme.textPrimary} leading-none`}
        >
          Change Crop Type
        </h1>
      </div>

      <div className="max-w-[768px] mx-auto w-full px-7 sm:px-15 flex flex-col flex-1">
        <p
          className={`${theme.textPrimary} text-[16px] sm:text-[18px] mb-10 leading-snug font-medium`}
        >
          {isSetupMode
            ? 'You can change crop type since growth period is not set yet.'
            : isHarvestDay
            ? 'You can now change crop type since harvest day has arrived.'
            : 'You cannot change crop type until you harvest the current crop.'}
        </p>

        <div className="mb-12">
          <label className="text-gray-400 text-[16px] block mb-2 font-medium">
            Current Crop Type:
          </label>
          <h2
            className={`text-[24px] sm:text-[28px] font-bold ${theme.textPrimary} mb-4`}
          >
            {cropType}
          </h2>

          <div className="w-full h-2 bg-[#E5F6D9] rounded-full overflow-hidden">
            <div
              className={`${
                isSetupMode ? 'bg-gray-300' : 'bg-gradient-to-b from-[#53C904] to-[#2F7302]'
              } h-full transition-all duration-1000 ease-out`}
              style={{ width: isSetupMode ? '0%' : `${progressPercentage}%` }}
            />
          </div>

          <div className="flex gap-1 mt-2 items-baseline text-[14px]">
            {isSetupMode ? (
              <span className="text-gray-400">Growth period not set</span>
            ) : (
              <>
                <span className="text-[#53C904] font-bold">{currentDay}</span>
                <span className="text-gray-400">
                  /{totalDays} days (
                  {isHarvestDay
                    ? 'harvest day'
                    : `${totalDays - currentDay} days till harvest`}
                  )
                </span>
              </>
            )}
          </div>
        </div>

        <div className="mt-auto py-10 flex justify-center">
          <Button
            onClick={handleChangeCropType}
            disabled={!canChangeCropType()}
            variant="gradient"
            className="w-full sm:max-w-[400px] h-[56px] text-[18px] bg-gradient-to-b from-[#53C904] to-[#2F7302]
                   hover:from-[#2F7302] hover:to-[#53C904]
                   focus:from-[#2F7302] focus:to-[#53C904]
                   disabled:bg-gradient-to-b disabled:from-[#AEAEAE] disabled:to-[#BDBDBD] font-bold "
          >
            Change Crop Type
          </Button>
        </div>
      </div>

      <div className={`w-full max-w-[768px] mx-auto ${theme.background}`}>
        <BottomNavigation activeTab="profile" />
      </div>
    </div>
  );
}