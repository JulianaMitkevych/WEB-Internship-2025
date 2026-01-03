'use client';

import { ReactNode, useState, useEffect } from 'react';

import { StorageContext } from './context';
import { Store } from './types';
import { TUser } from '@/types/types';

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

// localStorage key for user data persistence
const USER_STORAGE_KEY = 'growbox_user_data';

export const StorageProvider = (props: TStorageProviderProps) => {
  const { children } = props;

  // Function to load user data from localStorage
  const loadUserFromStorage = (): TUser | null => {
    if (typeof window === 'undefined') return null;

    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
      return null;
    }
  };

  // Function to save user data to localStorage
  const saveUserToStorage = (user: TUser | null) => {
    if (typeof window === 'undefined') return;

    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving user data to localStorage:', error);
    }
  };

  // Initialize state with data from localStorage
  const [store, setStore] = useState<Store>(() => ({
    ...initialState,
    user: loadUserFromStorage(),
  }));

  // Effect to save user data to localStorage whenever it changes
  useEffect(() => {
    saveUserToStorage(store.user);
  }, [store.user]);

  return (
    <StorageContext.Provider value={[store, setStore]}>
      {children}
    </StorageContext.Provider>
  );
};
