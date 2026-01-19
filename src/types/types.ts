import { LucideIcon } from 'lucide-react';
import type { FieldValue, Timestamp } from 'firebase-admin/firestore';

//  type for Next.js routs
export type TUserDb = Omit<TUser, 'createdAt'> & {
  createdAt: Timestamp | FieldValue;
};

export type TTab = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export enum EGrowthStatus {
  SETUP = 'setup', // користувач ще не обрав дату початку вирощування
  GROWING = 'growing', // вирощування в процесі
  HARVEST = 'harvest', // час збору врожаю
}

export type TUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  email: string | null;
  createdAt: string | null;
  cropType: ECropType | null;
  growthDay?: number;
  totalGrowthDays?: number;
  startDate?: string; // дата початку вирощування
  expectedDays?: number; // очікувана кількість днів вирощування
  status?: EGrowthStatus; // статус вирощування
};

export type TDevice = {
  id: string;
  name: string;
  settingsId: string;
};

export type TSetting = {
  id: string;
  light: {
    isEnabled: boolean;
    value: string;
  };
  temperature: string;
  humidity: string;
  nutrition: string;
  vent: {
    isEnabled: boolean;
    value: string;
  };
  watering: {
    isEnabled: boolean;
    value: string;
  };
};

export type TLightRecord = {
  date: Date;
  value: number;
  deviceId: string;
};

export type TTemperatureRecord = {
  date: Date;
  value: number;
  deviceId: string;
};

export type THumidityRecord = {
  date: Date;
  value: number;
  deviceId: string;
};

export type TNutritionRecord = {
  date: Date;
  value: number;
  deviceId: string;
};

export type TCropTypeOption = {
  id: number;
  name: ECropType;
};

export enum ECropType {
  MICROGREENS = 'Microgreens',
  HERBS = 'Herbs',
  VEGETABLES = 'Vegetables',
  MUSHROOMS = "Mushroom's",
  FLOWERING = 'Flowering Plants',
}
// _____________________

export const CropTypeLabels: Record<number, string> = {
  1: ECropType.MICROGREENS,
  2: ECropType.HERBS,
  3: ECropType.VEGETABLES,
  4: ECropType.MUSHROOMS,
  5: ECropType.FLOWERING,
};

export type TCountry = {
  value: string;
  label: string;
  searchText?: string;
  [key: string]: any;
};

export type TRegion = {
  value: string;
  label: string;
  searchText?: string;
  [key: string]: any;
};

// props for crop button component
export type CropButtonProps = {
  label: string;
  route?: string;
  onClick?: () => void;
  className?: string;
};
//  chart typeData
export type TChartPeriod = 'day' | 'week' | 'month';