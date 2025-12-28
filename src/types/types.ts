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

export type TUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  email: string | null;
  createdAt: string | null;
  cropType: ECropType | null;
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
