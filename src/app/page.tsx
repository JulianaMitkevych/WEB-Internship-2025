

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ROUTES } from '@/utils/constants';
import WelcomeScreen from '@/components/auth/WelcomeScreen'; 
import { RefreshToken } from '@/components/ui/refresh-token';

export default async function HomePage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has('authToken');
  const refreshToken = cookieStore.get('refreshToken');

  if (isAuthenticated) {
    redirect(ROUTES.PROFILE);
  }

  if (refreshToken?.value) {
    return <RefreshToken />;
  }

  return <WelcomeScreen />;
}
