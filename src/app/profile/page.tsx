'use client';
import { useState, useEffect } from 'react';
import { useStorage } from '@/hooks/useStorage';
import { useTheme } from '@/hooks/useTheme';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { History, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/utils/constants';
import LogoutButton from '@/components/profile-user/LogoutButton';

import { PlantIcon } from '@/assets/svg/PlantIcon';
import ChangeIcon from '@/assets/svg/ChangeIcon';
import WhiteHarvest from '@/assets/svg/WhiteHarvest';

export default function ProfilePage() {
  const [store] = useStorage();
  const { classes: themeClasses } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalHarvest = 5;
  const totalDays = 84;

  // Check if user can change crop type (only after harvest completion)
  const canChangeCropType = () => {
    if (!store.user?.cropType) return false; // Can't change if no crop type selected
    if (!store.user.growthDay || !store.user.totalGrowthDays) return false; // Can't determine if harvest is complete
    return store.user.growthDay >= store.user.totalGrowthDays; // Can change only after harvest
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} flex flex-col items-center`}>
      <div className="text-center">
        <h2 className="text-[28px] text-back font-bold text-black">Profile</h2>
      </div>

      <div className="w-full max-w-[768px] flex-1 pb-6">
        <div className="p-6  sm:p-16">
          <div className="bg-white rounded-[24px] p-6 shadow-[0_0_20px_rgba(0,0,0,0.1)] text-center mb-8">
            <div className="flex justify-center mb-4">
              <PlantIcon className="w-16 h-16  sm:w-18 sm:h-18" />
            </div>

            <h1 className="text-[22px] md:text-[24px] font-bold text-[#2F7302] mb-1">
              Fantastik Gin-10
            </h1>
            <p className="text-gray-400 text-[16px] sm:text-[18px]  mb-6">
              {mounted ? store.user?.email || 'No email' : ''}
            </p>

            <div className="flex justify-between items-center border-t border-gray-50 pt-6">
              <div className="flex-1">
                <p className="text-[11px] md:text-[14px] text-black mb-1">
                  Total Harvest
                </p>
                <p className="text-[16px]  md:text-[18px] font-bold text-[#53C904]">
                  {totalHarvest}
                </p>
              </div>
              <div className="h-10 w-[1px] bg-[#48BB78] opacity-30"></div>
              <div className="flex-1">
                <p className="text-[11px] md:text-[14px] text-black mb-1">
                  Corp Type
                </p>
                <p className="text-[16px] md:text-[18px] font-bold text-[#53C904]">
                  {mounted
                    ? store.user?.cropType || 'Microgreens'
                    : 'Loading...'}
                </p>
              </div>
              <div className="h-10 w-[1px] bg-[#48BB78] opacity-30"></div>
              <div className="flex-1">
                <p className="text-[11px]  sm:text-[14px]  text-black mb-1">
                  Total Days
                </p>
                <p className="text-[16px]  sm:text-[18px]  font-bold text-[#53C904]">
                  {totalDays}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push(ROUTES.CHANGE_CROP_TYPE_INTERMEDIATE)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-[16px] shadow-[0_0_20px_rgba(0,0,0,0.1)] group active:scale-[0.98] transition-all sm:min-h-[97px] hover:shadow-[0_0_25px_rgba(0,0,0,0.15)]"
            >
              <div className="flex items-center">
                <div className="mr-4">
                  <ChangeIcon className="w-6 h-6 sm:w-8  sm:h-8"   />
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-[10px] items-start ">
                  <span
                    className={`text-[16px]  sm:text-[18px]    font-medium ${
                      !canChangeCropType() ? 'text-gray-400' : 'text-[#2D3748]'
                    }`}
                  >
                    Change Crop Type
                  </span>
                  {!canChangeCropType() && store.user?.cropType && (
                    <span className="text-[10px] sm:text-[14px] text-gray-400 mt-1">
                      Available after harvest completion
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#2F7302]" />
            </button>

            <button
              onClick={() => router.push(ROUTES.MY_HARVEST)}
              className="w-full flex items-center sm:min-h-[97px] justify-between p-4 bg-white rounded-[16px] shadow-[0_0_20px_rgba(0,0,0,0.1)] group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center">
                <div className="mr-4">
                  <WhiteHarvest className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <span className="text-[16px]  sm:text-[18px]  font-medium text-black">
                  My Harvest
                </span>
              </div>
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#2F7302]" />
            </button>

            <button
              onClick={() => router.push(ROUTES.HISTORIC_DATA)}
              className="w-full  flex items-center justify-between sm:min-h-[97px] p-4 bg-white rounded-[16px] shadow-[0_0_20px_rgba(0,0,0,0.1)] group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center">
                <div className="mr-4">
                  <History className="w-6 h-6  sm:w-8 sm:h-8 text-[#2D5A27]" />
                </div>
                <span className="text-[16px] sm:text-[18px]    font-medium text-black">
                  Historic Data
                </span>
              </div>
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#2F7302]" />
            </button>

            <div className="pt-2 ">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      <div className=" bottom-0 w-full max-w-[768px] bg-white">
        <BottomNavigation activeTab="profile" />
      </div>
    </div>
  );
}
