import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ROUTES } from '@/utils';
import { RefreshToken } from '@/components/ui';

export default async function HomePage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has('authToken');
  const refreshToken = cookieStore.get('refreshToken');

  if (isAuthenticated) {
    redirect(ROUTES.LOGIN);
  }

  if (refreshToken?.value) {
    return <RefreshToken />;
  }

  redirect(ROUTES.LOGIN);
}
