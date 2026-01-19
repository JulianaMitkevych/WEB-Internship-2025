import { Dispatch, SetStateAction } from 'react';
import { TUser, TSetting } from '@/types/types';

export type Store = {
  user: TUser | null;
  error: string | null;
  successMessage: string | null;
  isLoading: boolean;
  lastListUrlParams: Record<string, string> | null;
  settings: TSetting | null;
};

export type SetStore = Dispatch<SetStateAction<Store>>;
