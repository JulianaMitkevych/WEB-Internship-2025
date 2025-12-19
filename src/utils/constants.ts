export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  // Protected routes
  PROFILE: '/profile',
  ONBOARDING: '/onboarding',
  SELECT_PLANTS: '/onboarding/select-plants',
  CONNECT_DEVICE: '/onboarding/connect-device',
  DASHBOARD: '/dashboard',
  DASHBOARD_WITH_PLANT: (plantId: string) => `/dashboard?plantId=${plantId}`,

  // Plants
  USER_PLANTS: '/userPlants',
  PLANT: (plantId: string) => `/userPlants/${plantId}`,

  PLANT_ROUTES: {
    LIGHT: (plantId: string) => `/userPlants/${plantId}/light`,
    HUMIDITY: (plantId: string) => `/userPlants/${plantId}/humidity`,
    TEMPERATURE: (plantId: string) => `/userPlants/${plantId}/temperature`,
    NUTRITION: (plantId: string) => `/userPlants/${plantId}/nutrition`,
    WATERING: (plantId: string) => `/userPlants/${plantId}/watering`,
    VENT: (plantId: string) => `/userPlants/${plantId}/vent`,
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
  ROUTES.SELECT_PLANTS,
  ROUTES.CONNECT_DEVICE,
  ROUTES.DASHBOARD,
  ROUTES.USER_PLANTS,
] as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
export type PublicRoute = (typeof PUBLIC_ROUTES)[number];
export type ProtectedRoute = (typeof PROTECTED_ROUTES)[number];
