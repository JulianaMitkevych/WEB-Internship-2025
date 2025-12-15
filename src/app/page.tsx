

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ROUTES } from '@/utils';
import WelcomeScreen from '@/components/auth/WelcomeScreen'; 
import { RefreshToken } from '@/components/ui';

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
