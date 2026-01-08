
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStorage } from '@/hooks/useStorage';
import { useTheme } from '@/hooks/useTheme';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { ChevronLeft } from 'lucide-react';
import { ROUTES } from '@/utils/constants';
import { Button } from '@/components/ui/button';

export default function ChangeCropTypeIntermediatePage() {
  const [store] = useStorage();
  const { classes: theme, mounted: themeMounted } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentDay = store.user?.growthDay || 12;
  const totalDays = store.user?.totalGrowthDays || 21;
  const cropType = store.user?.cropType || 'Microgreens';

  const progressPercentage = Math.min((currentDay / totalDays) * 100, 100);
  const isHarvestDay = currentDay >= totalDays;

  const canChangeCropType = () => {
    if (!store.user?.cropType) return false;
    if (!store.user.growthDay || !store.user.totalGrowthDays) return false;
    return store.user.growthDay >= store.user.totalGrowthDays;
  };

  const handleChangeCropType = () => {
    if (canChangeCropType()) {
      router.push(ROUTES.CHANGE_CROP_TYPE);
    }
  };

  if (!mounted || !themeMounted) return null;

  return (
    <div
      className={`min-h-screen ${theme.background} flex flex-col  px-5  sm:px-15    transition-colors duration-300`}
    >
      <div className="w-full max-w-[768px] mx-auto py-6 px-5    flex relative">
        <button
          onClick={() => router.back()}
          className="p-1 absolute left-4 rounded-full transition-all"
        >
          <ChevronLeft className={`w-8 h-8 ${theme.textPrimary}`} />
        </button>
        <h1
          className={`text-[24px]  ml-[45px]  sm:ml-[60px] sm:text-[26px] font-bold ${theme.textPrimary} w-full`}
        >
          Change Crop Type
        </h1>
      </div>

      <div className="max-w-[768px] mx-auto w-full px-7 sm:px-15    flex flex-col flex-1">
        <p
          className={`${theme.textPrimary} text-[16px] sm:text-[18px] mb-10 leading-snug font-medium`}
        >
          You cannot change crop type until you harvest the current crop.
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
              className="bg-gradient-to-b from-[#53C904] to-[#2F7302] h-[8px]  sm:h-[10px]  transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="flex gap-1 mt-2 items-baseline text-[14px]">
            <span className="text-[#53C904] font-bold">{currentDay}</span>
            <span className="text-gray-400">
              /{totalDays} days (
              {isHarvestDay
                ? 'harvest day'
                : `${totalDays - currentDay} days till harvest`}
              )
            </span>
          </div>
        </div>

        <div className="mt-auto py-10 flex justify-center">
          <Button
            onClick={handleChangeCropType}
            disabled={!canChangeCropType()}
            variant="gradient"
            className="w-full  sm:max-w-[400px] h-[56px] text-[18px] disabled:bg-gradient-to-b disabled:from-[#AEAEAE] disabled:to-[#BDBDBD] font-bold "
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
