import { Dispatch, SetStateAction } from 'react';
import { TUser } from '@/types/types';

export type Store = {
  user: TUser | null;
  error: string | null;
  successMessage: string | null;
  isLoading: boolean;
  lastListUrlParams: Record<string, string> | null;
};

export type SetStore = Dispatch<SetStateAction<Store>>;
