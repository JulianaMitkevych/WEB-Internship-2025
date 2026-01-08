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
  const { classes: themeClasses } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentDay = store.user?.growthDay || 12;
  const totalDays = store.user?.totalGrowthDays || 21;
  const progressPercentage = Math.min((currentDay / totalDays) * 100, 100);

  // Check if user can change crop type (only after harvest completion)
  const canChangeCropType = () => {
    if (!store.user?.cropType) return false; // Can't change if no crop type selected
    if (!store.user.growthDay || !store.user.totalGrowthDays) return false; // Can't determine if harvest is complete
    return store.user.growthDay >= store.user.totalGrowthDays; // Can change only after harvest
  };

  const handleChangeCropType = () => {
    if (canChangeCropType()) {
      router.push(ROUTES.CHANGE_CROP_TYPE);
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} flex flex-col items-center`}>
      {/* Header */}
      <div className="w-full max-w-[768px] p-4 flex items-center">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
        >
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="text-[24px] font-bold text-black">Change Crop Type</h1>
      </div>

      <div className="w-full max-w-[768px] flex-1 pb-6">
        <div className="p-6 sm:p-16">
          {/* Warning Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-[16px] p-4 mb-8">
            <p className="text-yellow-800 text-center font-medium">
              You cannot change crop type until you harvest the current crop.
            </p>
          </div>

          {/* Progress Section */}
          <div className={`${themeClasses.cardBackground} rounded-[24px] p-6 ${themeClasses.shadow} mb-8`}>
            <div className="text-center mb-6">
              <h2 className="text-[18px] font-bold text-black mb-2">
                Current Crop Progress
              </h2>
              <p className="text-gray-600">
                {mounted ? store.user?.cropType || 'Microgreens' : 'Loading...'}
              </p>
            </div>

            <div className="w-full mt-4 px-4 flex flex-col items-center">
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

          {/* Change Crop Type Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleChangeCropType}
              disabled={!canChangeCropType()}
              className={`w-full max-w-[327px] h-12 text-base font-semibold rounded-2xl shadow-md transition-all ${
                canChangeCropType()
                  ? 'bg-[#53C904] hover:bg-[#4ade80] text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {canChangeCropType() ? 'Select New Crop Type' : 'Harvest Required'}
            </Button>
          </div>
        </div>
      </div>

      <div className="bottom-0 w-full max-w-[768px] bg-white">
        <BottomNavigation activeTab="profile" />
      </div>
    </div>
  );
}
