'use client';

import { useRouter } from 'next/navigation';
import { Home, Settings, User } from 'lucide-react';
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
      ? 'text-green-600 font-medium'
      : 'text-gray-400';
  };

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
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
          <Settings className={`w-6 h-6 ${getTabStyle('settings')}`} />
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
