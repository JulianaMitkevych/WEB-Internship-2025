'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { cropTypes } from '@/app/crope-type/cropeList';
import CropButton from '@/components/base/crope-button/CropeButton';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { ROUTES } from '@/utils/constants';
import { useStorage } from '@/hooks/useStorage';
import { useApi } from '@/hooks/useApi';
import { useTheme } from '@/hooks/useTheme';
import { ECropType, EGrowthStatus } from '@/types/types';
import { differenceInDays } from 'date-fns';

type UpdateCropTypeResponse = {
  message: string;
  cropType: ECropType;
};

export default function ChangeCropTypePage() {
  const router = useRouter();
  const [store, setStore] = useStorage();
  const { post, loading } = useApi<UpdateCropTypeResponse>();
  const { classes: themeClasses } = useTheme();

  // Розрахунок днів вирощування на основі реальних дат
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

    // choose date but not start day grow
    const isFutureStart = now < startDate;
    const currentDay = isFutureStart
      ? 0 // growing not start
      : Math.max(1, differenceInDays(now, startDate) + 1);

    const totalDays = store.user.expectedDays;
    const progressPercentage = isFutureStart
      ? 0 // progress=0
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

  const { isSetupMode, isHarvestDay } = calculateGrowthData();

  // Check if user can change crop type
  const canChangeCropType = () => {
    if (!store.user?.cropType) return false; // Can't change if no crop type selected

    return (
      isSetupMode || isHarvestDay || store.user.status === EGrowthStatus.HARVEST
    );
  };

  // If user cannot change crop type, redirect back to profile
  useEffect(() => {
    if (!canChangeCropType()) {
      router.push(ROUTES.PROFILE);
    }
  }, [store.user, router]);

  // Find the current crop type ID or default to 1
  const getCurrentCropId = () => {
    if (!store.user?.cropType) return 1;
    const currentCrop = cropTypes.find(
      (crop) => crop.name === store.user.cropType
    );
    return currentCrop?.id || 1;
  };

  const [selectedId, setSelectedId] = useState<number>(getCurrentCropId());

  // Update selectedId when user data loads
  useEffect(() => {
    setSelectedId(getCurrentCropId());
  }, [store.user?.cropType]);

  const handleUpdateCropType = async () => {
    if (!store.user) {
      console.error('No user found');
      return;
    }

    try {
      const selectedCrop = cropTypes.find((crop) => crop.id === selectedId);
      if (!selectedCrop) return;

      await post('/api/auth/update-crop-type', {
        cropType: selectedCrop.name,
      });

      setStore((prev) => ({
        ...prev,
        user: prev.user ? { ...prev.user, cropType: selectedCrop.name } : null,
      }));

      // Go back to profile page
      router.push(ROUTES.PROFILE);
    } catch (err) {
      console.error('Failed to update crop type:', err);
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} w-full flex flex-col max-w-[786px] mx-auto`}>
      <div className="max-w-md mx-auto w-full px-5 py-6 flex flex-col min-h-screen">  
      <div className="w-full mb-8 flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => router.back()}
            className="p-1 flex-shrink-0 hover:opacity-80 rounded-full transition-all"
            aria-label="Go back"
          >
            <ChevronLeft
              className={`w-8 h-8 ${themeClasses.textPrimary}`}
            />
          </button>

          <h1
            className={`text-[24px] sm:text-[28px] font-bold ${themeClasses.textPrimary} leading-none`}
          >
            Change Crop Type
          </h1>
        </div>
          {store.user?.cropType && (
            <div className= "w-full  min-w-[290px] pt-[6px]  pb-[5px] bg-[#97B980] text-xl rounded-full transition-all duration-300 text-center outline-none">
            <p className="text-center text-gray-600 ">
              Current: {store.user.cropType}
            </p>
            </div>
          )}

        <div className="flex flex-col sm:gap-1 flex-grow justify-center items-center">
          {cropTypes.map((crop) => (
            <CropButton
              key={crop.id}
              label={crop.name}
              isActive={selectedId === crop.id}
              onClick={() => setSelectedId(crop.id)}
            />
          ))}
        </div>
        {/* Bottom Button Container */}
        <div className="mt-auto pt-6 sm:pt-10 flex justify-center
         ">
          <Button
            type="button"
            variant="gradient"
            onClick={handleUpdateCropType}
            disabled={loading}
            className="w-full max-w-[327px] h-12 text-base font-semibold text-white rounded-2xl shadow-md transition-all
            bg-gradient-to-b from-[#53C904] to-[#2F7302]
                   hover:from-[#2F7302] hover:to-[#53C904]
                   focus:from-[#2F7302] focus:to-[#53C904]"
          >
            {loading ? 'Updating...' : 'Update Crop Type'}
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="profile" />
    </div>
  );
}
