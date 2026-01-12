'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStorage } from '@/hooks/useStorage';
import { useTheme } from '@/hooks/useTheme';
import { ChevronLeft } from 'lucide-react';
import { ROUTES } from '@/utils/constants';
import { Button } from '@/components/ui/button';
import GrowBoxIcon from '@/assets/svg/GrowBoxIcon';

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
      className={`h-screen ${theme.background} flex flex-col  px-5  sm:px-15 max-w-[768px] m-auto  transition-colors duration-300`}
    >
      <div className="w-full max-w-[768px] mx-auto py-6 px-2 sm:py-7 sm:px-5 flex relative">
        <button
          onClick={() => router.back()}
          className="p-1 absolute left-4 rounded-full transition-all"
        >
          <ChevronLeft className={`w-8 h-8 ${theme.textPrimary}`} />
        </button>
        <h1
          className={`text-[22px]  ml-[50px]  sm:ml-[60px] sm:text-[24px] font-bold ${theme.textPrimary} w-full`}
        >
          Connect your mobile device to GrowBox
        </h1>
      </div>

      <div className="max-w-[768px] mx-auto w-full px-7 sm:px-15    flex flex-col flex-1">
        <p
          className={`${theme.textPrimary} text-[14px] text-start sm:text-[16px]  leading-snug font-medium`}
        >
          Make sure that Bluetooth on your mobile device is turned on.
        </p>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-8">
            <GrowBoxIcon size={130} />
          </div>

          <p
            className={`${theme.textPrimary} text-[16px] sm:text-[18px] text-[#999999] text-center leading-snug font-medium`}
          >
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
