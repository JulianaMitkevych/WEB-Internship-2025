import { useState, useEffect } from 'react';
import { useApi } from './useApi';

interface CurrentValues {
  temperature?: number;
  humidity?: number;
  light?: number;
  nutrition?: number;
  vent?: number;
  watering?: number;
}

export const useCurrentValues = () => {
  const { get } = useApi<any>();
  const [currentValues, setCurrentValues] = useState<CurrentValues>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentValues = async () => {
      setLoading(true);
      setError(null);

      try {
        const parameters = ['temperature', 'humidity', 'light', 'nutrition', 'vent', 'watering'];

        // Отримуємо останні дані для кожного параметра за день
        const promises = parameters.map(async (param) => {
          try {
            const response = await get(`/api/settings/history?period=day&parameter=${param}`);
            const data = response?.data || [];

            // Знаходимо останній запис
            if (data && data.length > 0) {
              const lastItem = data[data.length - 1];
              return {
                param,
                value: Number(lastItem[param]) || 0
              };
            }
            return null;
          } catch (err) {
            console.error(`Failed to fetch ${param}:`, err);
            return null;
          }
        });

        const results = await Promise.all(promises);

        const values: CurrentValues = {};
        results.forEach(result => {
          if (result) {
            values[result.param as keyof CurrentValues] = result.value;
          }
        });

        setCurrentValues(values);
      } catch (err: any) {
        console.error('Failed to fetch current values:', err);
        setError(err?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentValues();
  }, [get]);

  return { currentValues, loading, error };
};
