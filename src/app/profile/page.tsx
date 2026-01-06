// 'use client';

// import { useStorage } from '@/hooks/useStorage';
// import { BottomNavigation } from '@/components/ui/bottom-navigation';
// import { User, Settings, Wheat, BarChart3 } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import LogoutButton from '@/components/profile-user/LogoutButton';
// import { ROUTES } from '@/utils/constants';
// import { Button } from '@/components/ui/button';

// export default function ProfilePage() {
//   const [store] = useStorage();
//   const router = useRouter();

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Profile Content */}
//       <div className="flex-1 p-6">
//         <div className="max-w-md mx-auto">
//           <div className="bg-white rounded-2xl p-6 shadow-sm">
//             <div className="text-center mb-8">
//               <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
//                 <User className="w-10 h-10 text-gray-500" />
//               </div>
//               <h1 className="text-2xl font-bold text-gray-800 mb-2">
//                 {store.user?.firstName} {store.user?.lastName}
//               </h1>
//               <p className="text-gray-600">{store.user?.email}</p>
//               {store.user?.cropType && (
//                 <p className="text-green-600 font-medium mt-2">
//                   Growing: {store.user.cropType}
//                 </p>
//               )}
//             </div>

//             <div className="space-y-4">
//               <div className="bg-gray-50 p-4 rounded-xl">
//                 <h3 className="font-medium text-gray-800 mb-2">Account Information</h3>
//                 <div className="space-y-2 text-sm text-gray-600">
//                   <p><span className="font-medium">Phone:</span> {store.user?.phoneNumber || 'Not provided'}</p>
//                   <p><span className="font-medium">Member since:</span> {store.user?.createdAt ? new Date(store.user.createdAt).toLocaleDateString() : 'Unknown'}</p>
//                 </div>
//               </div>

//               {/* Navigation Buttons */}
//               <div className="space-y-3 pt-4">
//                 <h3 className="font-medium text-gray-800 mb-3">Account Actions</h3>

//                 <Button
//                   onClick={() => router.push(ROUTES.CHANGE_CROP_TYPE)}
//                   variant="outline"
//                   className="w-full justify-start h-12 text-left"
//                 >
//                   <Settings className="w-5 h-5 mr-3 text-gray-600" />
//                   Change Crop Type
//                 </Button>

//                 <Button
//                   onClick={() => router.push(ROUTES.MY_HARVEST)}
//                   variant="outline"
//                   className="w-full justify-start h-12 text-left"
//                 >
//                   <Wheat className="w-5 h-5 mr-3 text-gray-600" />
//                   My Harvest
//                 </Button>

//                 <Button
//                   onClick={() => router.push(ROUTES.HISTORIC_DATA)}
//                   variant="outline"
//                   className="w-full justify-start h-12 text-left"
//                 >
//                   <BarChart3 className="w-5 h-5 mr-3 text-gray-600" />
//                   Historic Data
//                 </Button>
//               </div>

//               <div className="pt-4">
//                 <LogoutButton />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Navigation */}
//       <BottomNavigation activeTab="profile" />
//     </div>
//   );
// }
'use client';
import { useStorage } from '@/hooks/useStorage';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { History, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/utils/constants';
import LogoutButton from '@/components/profile-user/LogoutButton'

import {PlantIcon} from '@/assets/svg/PlantIcon';
import ChangeIcon from '@/assets/svg/ChangeIcon';
import WhiteHarvest from '@/assets/svg/WhiteHarvest';

export default function ProfilePage() {
  const [store] = useStorage();
  const router = useRouter();

  const totalHarvest = 5;
  const totalDays = 84;

  return (
        <div className="min-h-screen bg-white flex flex-col items-center">

      <div className="text-center">
        <h2 className="text-[28px] text-back font-bold text-black">
          Profile
        </h2>
     </div>

      <div className="w-full max-w-[768px] flex-1 pb-24">
        <div className="p-6">
          <div className="bg-white rounded-[24px] p-6 shadow-[0_0_20px_rgba(0,0,0,0.1)] text-center mb-8">
            <div className="flex justify-center mb-4">
              <PlantIcon className="w-16 h-16" />
            </div>

            <h1 className="text-[22px] md:text-[24px] font-bold text-[#2F7302] mb-1">
              Fantastik Gin-10
            </h1>
            <p className="text-gray-400 text-sm mb-6">{store.user?.email}</p>

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
                  {store.user?.cropType || 'Microgreens'}
                </p>
              </div>
              <div className="h-10 w-[1px] bg-[#48BB78] opacity-30"></div>
              <div className="flex-1">
                <p className="text-[11px]  md:text-[14px]  text-black mb-1">
                  Total Days
                </p>
                <p className="text-[16px]  md:text-[18px]  font-bold text-[#53C904]">
                  {totalDays}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push(ROUTES.CHANGE_CROP_TYPE)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-[16px] shadow-[0_0_20px_rgba(0,0,0,0.1)] group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center">
                <div className="mr-4">
                  <ChangeIcon className="w-6 h-6" />
                </div>
                <span className="text-[16px] font-medium text-[#2D3748]">
                  Change Crop Type
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#2D3748]" />
            </button>

            <button
              onClick={() => router.push(ROUTES.MY_HARVEST)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-[16px] shadow-[0_0_20px_rgba(0,0,0,0.1)] group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center">
                <div className="mr-4">
                  <WhiteHarvest className="w-6 h-6" />
                </div>
                <span className="text-[16px] font-medium text-[#2D3748]">
                  My Harvest
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#2D3748]" />
            </button>

            <button
              onClick={() => router.push(ROUTES.HISTORIC_DATA)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-[16px] shadow-[0_0_20px_rgba(0,0,0,0.1)] group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center">
                <div className="mr-4">
                  <History className="w-6 h-6 text-[#2D5A27]" />
                </div>
                <span className="text-[16px] font-medium text-[#2D3748]">
                  Historic Data
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#2D3748]" />
            </button>

            <div className="pt-2">
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
