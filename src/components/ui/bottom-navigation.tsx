'use client';

import { useRouter } from 'next/navigation';
import { Home, Settings2, User } from 'lucide-react';
import { ROUTES } from '@/utils/constants';

type ActiveTab = 'home' | 'settings' | 'profile';

interface BottomNavigationProps {
  activeTab: ActiveTab;
}

export const BottomNavigation = ({ activeTab }: BottomNavigationProps) => {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  const getTabStyle = (tab: ActiveTab) => {
    return activeTab === tab
      ? 'text-[#53C904] font-medium'
      : 'text-gray-400';
  };

  return (
    <div className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] px-6 p-4">
      <div className="max-w-md mx-auto flex justify-around">
        <button
          onClick={() => handleNavigation(ROUTES.DASHBOARD)}
          className="flex flex-col items-center gap-1"
        >
          <Home className={`w-6 h-6 ${getTabStyle('home')}`} />
          <span className={`text-xs ${getTabStyle('home')}`}>Home</span>
        </button>
        <button
          onClick={() => handleNavigation(ROUTES.SETTINGS)}
          className="flex flex-col items-center gap-1"
        >
          <Settings2 className={`w-6 h-6 ${getTabStyle('settings')}`} />
          <span className={`text-xs ${getTabStyle('settings')}`}>Settings</span>
        </button>
        <button
          onClick={() => handleNavigation(ROUTES.PROFILE)}
          className="flex flex-col items-center gap-1"
        >
          <User className={`w-6 h-6 ${getTabStyle('profile')}`} />
          <span className={`text-xs ${getTabStyle('profile')}`}>Profile</span>
        </button>
      </div>
    </div>
  );
};
