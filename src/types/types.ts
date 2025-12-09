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
};

