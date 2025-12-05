export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  API: {
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      SIGN_UP: '/api/auth/sign-up',
    },
  },
} as const;

export const PUBLIC_ROUTES = [ROUTES.LOGIN] as const;

export const PROTECTED_ROUTES = [ROUTES.HOME] as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
export type PublicRoute = (typeof PUBLIC_ROUTES)[number];
export type ProtectedRoute = (typeof PROTECTED_ROUTES)[number];
