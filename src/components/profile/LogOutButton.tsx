
'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useApi } from '@/hooks/useApi';
import { useStorage } from '@/hooks/useStorage';
import { ROUTES } from '@/utils';
import { Button } from '@/components/ui/button';

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
    <Button
      onClick={handleLogout}
      disabled={loading}
      variant="ghost"
      className="flex items-center justify-start h-12 w-full text-base font-medium text-destructive hover:bg-destructive/10"
      aria-label="Log out"
    >
      <LogOut size={20} className="mr-3" />
      Log Out
    </Button>
  );
};

export default LogoutButton;
