'use client';

import { ReactNode, useState } from 'react';

import { StorageContext } from './context';
import { Store } from './types';

type TStorageProviderProps = {
  children: ReactNode;
};

export const initialState: Store = {
  user: null,
  error: null,
  successMessage: null,
  isLoading: false,
  lastListUrlParams: null,
  settings: null,
};

export const StorageProvider = (props: TStorageProviderProps) => {
  const { children } = props;

  const [store, setStore] = useState<Store>(initialState);

  return (
    <StorageContext.Provider value={[store, setStore]}>
      {children}
    </StorageContext.Provider>
  );
};
