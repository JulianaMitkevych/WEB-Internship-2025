
'use client';

import { LogOut, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useApi } from '@/hooks/useApi';
import { useStorage } from '@/hooks/useStorage';
import { ROUTES } from '@/utils/constants';

const LogoutButton = () => {
  const router = useRouter();
  const { post, loading } = useApi();
  const [, setStore] = useStorage();

  const handleLogout = async () => {
    try {
      await post(ROUTES.API.AUTH.LOGOUT, {});
      setStore((prev) => ({
        ...prev,
        user: null,
        token: null,
      }));
      router.push(ROUTES.LOGIN);
    } catch (e) {
      console.error('Logout failed:', e);
      setStore((prev) => ({ ...prev, user: null, token: null }));
      router.push(ROUTES.LOGIN);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center justify-between p-4 bg-white rounded-[16px] shadow-[0_0_20px_rgba(0,0,0,0.1)] group active:scale-[0.98] transition-all"
      aria-label="Log out"
    >
      <div className="flex items-center">
        <div className="mr-4">
          <LogOut className="w-6 h-6 text-[#EB5757]" />
        </div>
        <span className="text-[16px] md:text-[18px] font-medium text-[#EB5757]">
          Log Out
        </span>
      </div>

      <ChevronRight className="w-5 h-5 text-[#2D3748]" />
    </button>
  );
};

export default LogoutButton;
