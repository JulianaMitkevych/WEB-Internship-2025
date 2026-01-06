
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
  //  loading
  const { post, loading } = useApi<UpdateCropTypeResponse>();
  const [selectedId, setSelectedId] = useState<number>(1);

  // If user already has crop type, redirect to dashboard
  useEffect(() => {
    if (store.user?.cropType) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [store.user?.cropType, router]);

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
      <div className="max-w-md mx-auto w-full px-6 py-8  flex flex-col min-h-screen">
      {/* Header */}
<div className=" mb-8 w-full">
  <button
    onClick={() => router.back()}
    className="mb-[16px] p-1 -ml-1 hover:bg-gray-100 rounded-full transition-colors"
    aria-label="Go back"
  >
    <ChevronLeft className="size-7 sm:size-8 text-black" />
  </button>
  
  <h1 className="text-[28px] text-center font-bold text-black leading-tight">
    Select crop type
  </h1>
</div>
         <div className="flex flex-col sm:gap-1  flex-grow justify-center items-center">
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
            onClick={handleStartPlanting}
            disabled={loading}
            className="w-full max-w-[327px] h-12 text-base font-semibold text-white rounded-2xl shadow-md transition-all"
          >
            {loading ? 'Saving...' : 'Start planting'}
          </Button>
        </div>
      </div>
    </div>
  );
}