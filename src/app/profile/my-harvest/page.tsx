

"use client"
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { useTheme } from '@/hooks/useTheme';

interface Harvestharvest {
  id: string | number;
  cropType: string;
  harvests: number;
  totalDays: number;
  isPlaceholder?: boolean;
}

export default function MyHarvestPage() {
  const router = useRouter();
  const { classes: themeClasses } = useTheme();

  const realHarvests: Harvestharvest[] = [
    {
      id: 'harvest-1',
      cropType: 'Microgreens',
      harvests: 3,
      totalDays: 93,
    },
    {
      id: 'harvest-2',
      cropType: 'Herbs',
      harvests: 1,
      totalDays: 21,
    },
  ];

  const gridCards: Harvestharvest[] = Array.from({ length: 6 }).map((_, index) => {
    if (realHarvests[index]) {
      return realHarvests[index];
    }
    return {
      id: `empty-${index}`,
      cropType: 'No Crop',
      harvests: 0,
      totalDays: 0,
      isPlaceholder: true,
    };
  });

  return (
    <div className={`min-h-screen ${themeClasses.background} flex flex-col  max-w-[768px] mx-auto `}>
      <div className="relative flex  items-center justify-start py-8 px-4  sm:px-12">
        <button
          onClick={() => router.back()}
          className="absolute left-6 p-1  hover:bg-transparent hover:opacity-70 transition-opacity active:scale-95"
        >
          <ChevronLeft className={`w-8 h-8 ${themeClasses.textPrimary}`} />
        </button>
        <h1 className={`text-[24px] sm:text-[26px] pl-16 font-bold ${themeClasses.textPrimary}`}>
          My Harvest
        </h1>
      </div>

      <div className="px-4 sm:px-12   flex-1 mb-[60px]">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 ">
          {gridCards.map((harvest) => (
            <div
              key={harvest.id}
              className={`${themeClasses.cardBackground} rounded-[24px]  sm:min-w-[156px] p-[14px]  sm:p-6  flex flex-col  text-left sm:text-center  items-start justify-start sm:items-center sm:justify-center ${themeClasses.shadow} ${themeClasses.border}`}
            >
              <div className="  w-[60px]  h-[60px]  sm:w-[86px] sm:h-[86px] relative mb-4  ">
                <Image
                  src="/images/green.png"
                  alt="Plant"
                  fill
                  priority
                  sizes="86px"
                  className="object-cover rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
                />
              </div>

              <h3
                className={`font-bold text-[16px]  sm:text-[18px] mb-1 sm:mb-3    leading-tight ${
                  !harvest.isPlaceholder ? 'text-[#53C904]' : 'text-gray-400 '
                }`}
              >
                {harvest.cropType}
              </h3>

              <div className="space-y-1 w-full">
                <p className="text-[14px] text-black">
                  <span className={`${themeClasses.textPrimary} font-regular`}>Harvests: </span>
                  <span
                    className={
                      !harvest.isPlaceholder
                        ? 'font-bold text-[#2F7302] text-[14px]  '
                        : 'text-gray-300 text-[10px] sm:text-[14px]'
                    }
                  >
                    {!harvest.isPlaceholder ? harvest.harvests : 'no data'}
                  </span>
                </p>
                <p className="text-[14px] text-black">
                  <span className={`${themeClasses.textPrimary} font-medium`}>Total Days:</span>
                  <span
                    className={
                      !harvest.isPlaceholder
                        ? 'font-bold text-[#2F7302]  pl-[5px]   text-[14px]'
                        : 'text-gray-300 pl-[5px] text-[12px] sm:text-[14px] '
                    }
                  >
                    {!harvest.isPlaceholder ? harvest.totalDays : '0'}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation activeTab="profile" />
    </div>
  );
}
