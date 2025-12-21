export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  // Protected routes
  PROFILE: '/profile',
  ONBOARDING: '/onboarding',
  SELECT_CROP_TYPE: '/crope-type',
  CONNECT_DEVICE: '/onboarding/connect-device',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',

  // Plant management routes (for future use)
  USER_PLANTS: '/user-plants',
  PLANT: (plantId: string) => `/user-plants/${plantId}`,

  // Dashboard settings routes
  PLANT_SETTINGS: {
    LIGHT: '/dashboard/light',
    HUMIDITY: '/dashboard/humidity',
    TEMPERATURE: '/dashboard/temperature',
    NUTRITION: '/dashboard/nutrition',
    WATERING: '/dashboard/watering',
    VENT: '/dashboard/vent',
  },

  // API routes
  API: {
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      SIGN_UP: '/api/auth/sign-up',
      REFRESH: '/api/auth/refresh',
    },
  },
} as const;

// Public routes 
export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.HOME,
] as const;

// Protected routes
export const PROTECTED_ROUTES = [
  ROUTES.PROFILE,
  ROUTES.ONBOARDING,
  ROUTES.SELECT_CROP_TYPE,
  ROUTES.CONNECT_DEVICE,
  ROUTES.DASHBOARD,
  ROUTES.SETTINGS,
  ROUTES.USER_PLANTS,
] as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
export type PublicRoute = (typeof PUBLIC_ROUTES)[number];
export type ProtectedRoute = (typeof PROTECTED_ROUTES)[number];
