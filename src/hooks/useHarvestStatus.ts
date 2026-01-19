import { useEffect } from 'react';
import { useStorage } from './useStorage';
import { useApi } from './useApi';
import { EGrowthStatus } from '@/types/types';

type CheckHarvestResponse = {
  message: string;
  status: EGrowthStatus;
  shouldUpdateLocal: boolean;
};

export const useHarvestStatus = () => {
  const [store, setStore] = useStorage();
  const { post } = useApi<CheckHarvestResponse>();

  const checkHarvestStatus = async () => {
    try {
      const response = await post('/api/auth/check-harvest-status');

      if (response.shouldUpdateLocal && store.user) {
        // Оновлюємо локальний стан користувача
        setStore((prev) => ({
          ...prev,
          user: {
            ...prev.user!,
            status: response.status,
          },
        }));
      }
    } catch (error) {
      console.error('Error checking harvest status:', error);
    }
  };

  // Перевіряємо статус при завантаженні компонента
  useEffect(() => {
    if (store.user?.status === EGrowthStatus.GROWING) {
      checkHarvestStatus();
    }
  }, [store.user?.status]);

  return { checkHarvestStatus };
};
