'use client';

import { useStorage } from '@/hooks/useStorage';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { User, Settings, Wheat, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LogoutButton from '@/components/profile-user/LogoutButton';
import { ROUTES } from '@/utils/constants';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const [store] = useStorage();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Profile Content */}
      <div className="flex-1 p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-10 h-10 text-gray-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {store.user?.firstName} {store.user?.lastName}
              </h1>
              <p className="text-gray-600">{store.user?.email}</p>
              {store.user?.cropType && (
                <p className="text-green-600 font-medium mt-2">
                  Growing: {store.user.cropType}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-medium text-gray-800 mb-2">Account Information</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Phone:</span> {store.user?.phoneNumber || 'Not provided'}</p>
                  <p><span className="font-medium">Member since:</span> {store.user?.createdAt ? new Date(store.user.createdAt).toLocaleDateString() : 'Unknown'}</p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="space-y-3 pt-4">
                <h3 className="font-medium text-gray-800 mb-3">Account Actions</h3>

                <Button
                  onClick={() => router.push(ROUTES.CHANGE_CROP_TYPE)}
                  variant="outline"
                  className="w-full justify-start h-12 text-left"
                >
                  <Settings className="w-5 h-5 mr-3 text-gray-600" />
                  Change Crop Type
                </Button>

                <Button
                  onClick={() => router.push(ROUTES.MY_HARVEST)}
                  variant="outline"
                  className="w-full justify-start h-12 text-left"
                >
                  <Wheat className="w-5 h-5 mr-3 text-gray-600" />
                  My Harvest
                </Button>

                <Button
                  onClick={() => router.push(ROUTES.HISTORIC_DATA)}
                  variant="outline"
                  className="w-full justify-start h-12 text-left"
                >
                  <BarChart3 className="w-5 h-5 mr-3 text-gray-600" />
                  Historic Data
                </Button>
              </div>

              <div className="pt-4">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="profile" />
    </div>
  );
}
