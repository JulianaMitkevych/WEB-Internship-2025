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
import { ECropType } from '@/types/types';

type UpdateCropTypeResponse = {
  message: string;
  cropType: ECropType;
};

export default function ChangeCropTypePage() {
  const router = useRouter();
  const [store, setStore] = useStorage();
  const { post, loading } = useApi<UpdateCropTypeResponse>();
  const { classes: themeClasses } = useTheme();

  // Check if user can change crop type (only after harvest completion)
  const canChangeCropType = () => {
    if (!store.user?.cropType) return false; // Can't change if no crop type selected
    if (!store.user.growthDay || !store.user.totalGrowthDays) return false; // Can't determine if harvest is complete
    return store.user.growthDay >= store.user.totalGrowthDays; // Can change only after harvest
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
    const currentCrop = cropTypes.find(crop => crop.name === store.user.cropType);
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
    <div className={`min-h-screen ${themeClasses.background} flex flex-col`}>
      <div className="max-w-md mx-auto w-full px-6 py-8 flex flex-col min-h-screen">
        {/* Header */}
        <div className="mb-8 w-full">
          <button
            onClick={() => router.back()}
            className="mb-[16px] p-1 -ml-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className={`size-7 sm:size-8 ${themeClasses.textPrimary}`} />
          </button>

          <h1 className={`text-[28px] text-center font-bold ${themeClasses.textPrimary} leading-tight`}>
            Change Crop Type
          </h1>

          {store.user?.cropType && (
            <p className="text-center text-gray-600 mt-2">
              Current: {store.user.cropType}
            </p>
          )}
        </div>

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
        <div className="mt-auto pt-6 sm:pt-10 flex justify-center">
          <Button
            type="button"
            variant="gradient"
            onClick={handleUpdateCropType}
            disabled={loading}
            className="w-full max-w-[327px] h-12 text-base font-semibold text-white rounded-2xl shadow-md transition-all"
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


