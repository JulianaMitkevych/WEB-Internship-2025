export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  // Protected routes
  PROFILE: '/profile',
  CHANGE_CROP_TYPE_INTERMEDIATE: '/profile/change-crop-type-intermediate',
  CHANGE_CROP_TYPE: '/profile/change-crop-type',
  SET_GROWTH_DATE: '/profile/set-growth-date',
  MY_HARVEST: '/profile/my-harvest',
  HISTORIC_DATA: '/profile/historic-data',
  ONBOARDING: '/onboarding',
  SELECT_CROP_TYPE: '/crope-type',
  CONNECT_DEVICE: '/connect-device',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',

  // Plant management routes (for future use)
  USER_PLANTS: '/user-plants',
  PLANT: (plantId: string) => `/user-plants/${plantId}`,

  // Settings routes
  PLANT_SETTINGS: {
    LIGHT: '/settings/light',
    HUMIDITY: '/settings/humidity',
    TEMPERATURE: '/settings/temperature',
    NUTRITION: '/settings/nutrition',
    WATERING: '/settings/watering',
    VENT: '/settings/vent',
  },

  // Historic data routes
  HISTORIC_DATA_PARAMS: {
    LIGHT: '/profile/historic-data/light',
    HUMIDITY: '/profile/historic-data/humidity',
    TEMPERATURE: '/profile/historic-data/temperature',
    NUTRITION: '/profile/historic-data/nutrition',
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
  ROUTES.CHANGE_CROP_TYPE_INTERMEDIATE,
  ROUTES.CHANGE_CROP_TYPE,
  ROUTES.SET_GROWTH_DATE,
  ROUTES.MY_HARVEST,
  ROUTES.HISTORIC_DATA,
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
