import { Dispatch, SetStateAction } from 'react';
import { TUser } from '@/types/types';

export type UserWithoutCropType = Omit<TUser, 'cropType'>;

export type Store = {
  user: UserWithoutCropType | null;
};

export type SetStore = Dispatch<SetStateAction<Store>>;
