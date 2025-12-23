'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { cropTypes } from '@/app/crope-type/cropeList';
import CropButton from '@/components/base/crope-button/CropeButton';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/utils/constants';
import { useStorage } from '@/hooks/useStorage';
import { useApi } from '@/hooks/useApi';
import { ECropType } from '@/types/types';

type UpdateCropTypeResponse = {
  message: string;
  cropType: ECropType;
};

export default function SelectCropTypePage() {
  const router = useRouter();
  const [store, setStore] = useStorage();
  const { post } = useApi<UpdateCropTypeResponse>();
  const [selectedId, setSelectedId] = useState<number>(1);

  const handleStartPlanting = async () => {
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

      // Update local storage with the new crop type
      setStore((prev) => ({
        ...prev,
        user: prev.user ? { ...prev.user, cropType: selectedCrop.name } : null,
      }));

      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      console.error('Failed to save crop type:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="max-w-md mx-auto w-full px-6 py-6 sm:py-10 flex flex-col flex-grow">
        <div className="relative flex items-center mb-10 sm:mb-16">
          <button
            onClick={() => router.back()}
            className="absolute left-0 z-10 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="size-7 sm:size-8 text-black" />
          </button>
          <h1 className="w-full text-center text-2xl sm:text-3xl font-bold text-black leading-tight px-10">
            Select crop type
          </h1>
        </div>

        <div className="flex flex-col gap-1 sm:gap-2 flex-grow justify-center">
          {cropTypes.map((crop) => (
            <CropButton
              key={crop.id}
              label={crop.name}
              isActive={selectedId === crop.id}
              onClick={() => setSelectedId(crop.id)}
            />
          ))}
        </div>

        <div className="mt-auto pt-6 sm:pt-10">
          <Button
            variant="gradient"
            size="default"
            onClick={handleStartPlanting}
            className="w-full h-12 sm:h-14 text-lg sm:text-xl font-bold rounded-2xl shadow-lg"
          >
            Start planting
          </Button>
        </div>
      </div>
    </div>
  );
}
