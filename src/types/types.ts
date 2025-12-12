import { LucideIcon } from 'lucide-react';

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
  cropType: ECropType;
};

export enum ECropType {
  VEGETABLES = 'Vegetables',
}

export type TDevice = {
  id: string;
  name: string;
  settingsId: string;
};

export type TSetting = {
  id: string;
  light: string;
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
