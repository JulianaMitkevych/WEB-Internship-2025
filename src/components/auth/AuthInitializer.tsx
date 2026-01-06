'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { useApi } from '@/hooks/useApi';
import { useStorage } from '@/hooks/useStorage';
import { ROUTES, PUBLIC_ROUTES } from '@/utils/constants';
import { TUser } from '@/types/types';

type AuthCheckResponse = {
  user: Partial<TUser> & { id: string; email: string | null };
  message: string;
};

export const AuthInitializer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [store, setStore] = useStorage();
  const { post } = useApi<AuthCheckResponse>();

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Skip auth check for public routes
      if (PUBLIC_ROUTES.includes(pathname as any)) {
        return;
      }

      // If we don't have user data in storage, try to validate session
      if (!store.user) {
        try {
          // This endpoint should validate the current session and return user data
          const response = await post('/api/auth/validate-session', {});

          if (response?.user) {
            const normalizedUser: TUser = {
              id: response.user.id,
              email: response.user.email ?? null,
              firstName: response.user.firstName ?? null,
              lastName: response.user.lastName ?? null,
              phoneNumber: response.user.phoneNumber ?? null,
              cropType: response.user.cropType ?? null,
              createdAt: response.user.createdAt ?? null,
            };

            setStore((prev) => ({ ...prev, user: normalizedUser }));

            // If user already has crop type and is trying to access onboarding or crop-type pages, redirect to dashboard
            if (normalizedUser.cropType && (pathname === ROUTES.ONBOARDING || pathname === ROUTES.SELECT_CROP_TYPE)) {
              router.push(ROUTES.DASHBOARD);
              return;
            }
          } else {
            // No valid session, redirect to login
            router.push(ROUTES.LOGIN);
          }
        } catch (error) {
          console.error('Session validation failed:', error);
          // Clear any stale data and redirect to login
          setStore((prev) => ({ ...prev, user: null }));
          router.push(ROUTES.LOGIN);
        }
      } else {
        // User data exists, check if they should be redirected
        if (store.user.cropType && (pathname === ROUTES.ONBOARDING || pathname === ROUTES.SELECT_CROP_TYPE)) {
          router.push(ROUTES.DASHBOARD);
        }
      }
    };

    checkAuthStatus();
  }, [pathname, store.user, post, router, setStore]);

  // This component doesn't render anything
  return null;
};

