'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, Wheat, Calendar, TrendingUp } from 'lucide-react';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { useStorage } from '@/hooks/useStorage';
import { Card } from '@/components/ui/card';

export default function MyHarvestPage() {
  const router = useRouter();
  const [store] = useStorage();

  // Mock data for demonstration - in real app this would come from API
  const mockHarvests = [
    {
      id: 1,
      cropType: store.user?.cropType || 'Microgreens',
      plantedDate: '2024-12-01',
      expectedHarvest: '2024-12-15',
      status: 'Growing',
      progress: 75,
    },
    {
      id: 2,
      cropType: 'Herbs',
      plantedDate: '2024-11-20',
      expectedHarvest: '2024-12-10',
      status: 'Growing',
      progress: 90,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-md mx-auto w-full px-6 py-8 flex flex-col min-h-screen">
        {/* Header */}
        <div className="mb-8 w-full">
          <button
            onClick={() => router.back()}
            className="mb-[16px] p-1 -ml-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="size-7 sm:size-8 text-black" />
          </button>

          <h1 className="text-[28px] text-center font-bold text-black leading-tight">
            My Harvest
          </h1>

          <p className="text-center text-gray-600 mt-2">
            Track your growing plants
          </p>
        </div>

        {/* Content */}
        <div className="flex-1">
          {mockHarvests.length > 0 ? (
            <div className="space-y-4">
              {mockHarvests.map((harvest) => (
                <Card key={harvest.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Wheat className="w-5 h-5 text-green-600 mr-2" />
                      <h3 className="font-semibold text-gray-800">
                        {harvest.cropType}
                      </h3>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      harvest.status === 'Growing'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {harvest.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Planted: {new Date(harvest.plantedDate).toLocaleDateString()}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Expected harvest: {new Date(harvest.expectedHarvest).toLocaleDateString()}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{harvest.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${harvest.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Wheat className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No plants yet
              </h3>
              <p className="text-gray-500">
                Start growing by selecting a crop type in your profile
              </p>
            </div>
          )}
        </div>

        {/* Bottom spacing for navigation */}
        <div className="h-20"></div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="profile" />
    </div>
  );
}
