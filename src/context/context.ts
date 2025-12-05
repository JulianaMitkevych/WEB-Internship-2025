import { createContext } from 'react';

import { SetStore, Store } from './types';

export const StorageContext = createContext<[Store, SetStore] | undefined>(
  undefined
);
