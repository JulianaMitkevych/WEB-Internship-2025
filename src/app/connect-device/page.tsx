'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStorage } from '@/hooks/useStorage';
import { useTheme } from '@/hooks/useTheme';
import { ChevronLeft } from 'lucide-react';
import { ROUTES } from '@/utils/constants';
import { Button } from '@/components/ui/button';
import PlantIcon from '@/assets/svg/PlantIcon';

export default function ConnectDevicePage() {
  const [store] = useStorage();
  const { classes: theme, mounted: themeMounted } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to dashboard if user already has crop type
  useEffect(() => {
    if (store.user?.cropType) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [store.user?.cropType, router]);

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
          Connect your mobile device to GrowBox
        </h1>
      </div>

      <div className="max-w-[768px] mx-auto w-full px-7 sm:px-15    flex flex-col flex-1">
        <p
          className={`${theme.textPrimary} text-[16px] sm:text-[18px] mb-10 leading-snug font-medium`}
        >
          Make sure that Bluetooth on your mobile device is turned on
        </p>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-8">
            <PlantIcon size={120} />
          </div>

          <p className={`${theme.textPrimary} text-[16px] sm:text-[18px] text-center leading-snug font-medium`}>
            This feature is currently unavailable to you.
          </p>
        </div>

        <div className="mt-auto py-10 flex justify-center">
          <Button
            disabled={true}
            variant="gradient"
            className="w-full  sm:max-w-[400px] h-[56px] text-[18px] disabled:bg-gradient-to-b disabled:from-[#AEAEAE] disabled:to-[#BDBDBD] font-bold "
          >
            Connect your device
          </Button>
        </div>
      </div>
    </div>
  );
}
