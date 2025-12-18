export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ONBOARDING: '/onboarding',
  SELECT_PLANTS: '/onboarding/select-plants', 
  CONNECT_DEVICE: '/onboarding/connect-device', 
  DASHBOARD: '/dashboard', // home,settings, profile

  API: {
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      SIGN_UP: '/api/auth/sign-up',
      REFRESH: '/api/auth/refresh',
    },
  },
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.HOME,
] as const;

export const PROTECTED_ROUTES = [
  ROUTES.PROFILE,
  ROUTES.ONBOARDING,
  ROUTES.DASHBOARD,
] as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
export type PublicRoute = (typeof PUBLIC_ROUTES)[number];
export type ProtectedRoute = (typeof PROTECTED_ROUTES)[number];
