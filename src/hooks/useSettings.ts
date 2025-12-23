'use client';

import { useContext, useEffect, useState } from 'react';
import { StorageContext } from '@/context/context';
import { TSetting } from '@/types/types';
import { useApi } from './useApi';

type UpdateSettingsResponse = {
  message: string;
  settings: any;
};

export const useSettings = () => {
  const [store, setStore] = useContext(StorageContext);
  const { post } = useApi<UpdateSettingsResponse>();
  const [isLoading, setIsLoading] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      if (!store?.user?.id) return;

      try {
        // For now, we'll initialize with default settings since we don't have a get endpoint
        // In a real app, you'd call an API to get current settings
        const defaultSettings: TSetting = {
          id: store.user.id,
          light: '50',
          temperature: '22',
          humidity: '60',
          nutrition: '30',
          vent: {
            isEnabled: true,
            value: '45',
          },
          watering: {
            isEnabled: true,
            value: '60',
          },
        };

        setStore(prev => ({
          ...prev,
          settings: defaultSettings,
        }));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    loadSettings();
  }, [store?.user?.id, setStore]);

  const updateSettings = async (newSettings: Partial<TSetting>) => {
    if (!store?.user?.id) return;

    setIsLoading(true);
    try {
      const response = await post('/api/settings/update', newSettings);

      if (response) {
        // Update local state
        setStore(prev => ({
          ...prev,
          settings: prev.settings
            ? { ...prev.settings, ...newSettings }
            : { id: store.user!.id, ...newSettings } as TSetting,
        }));
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    settings: store?.settings,
    updateSettings,
    isLoading,
  };
};
