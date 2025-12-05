import { Dispatch, SetStateAction } from 'react';
import { TUser } from '@/types/types';

export type Store = {
  user: TUser | null;
};

export type SetStore = Dispatch<SetStateAction<Store>>;
