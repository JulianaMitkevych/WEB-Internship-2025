import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { TChartPeriod } from '@/types/types';

interface ChartDataItem {
  name: string;
  value: number;
  date?: string;
}

interface UseChartDataOptions {
  parameter: string;
  period: TChartPeriod;
}

export const useChartData = ({ parameter, period }: UseChartDataOptions) => {
  const { get } = useApi<any>();
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAndProcessData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await get(
        `/api/settings/history?period=${period}&parameter=${parameter}`
      );

      let historyItems = [];
      if (Array.isArray(response)) {
        historyItems = response;
      } else if (response?.data && Array.isArray(response.data)) {
        historyItems = response.data;
      }

      console.log('useChartData:', { parameter, period, response, historyItems });

      if (historyItems.length > 0) {
        let formattedChartData: ChartDataItem[] = [];

        // --- ОБРОБКА ДЕННОГО ПЕРІОДУ ---
        if (period === 'day') {
          formattedChartData = historyItems
            .sort((a: any, b: any) => {
              // Конвертуємо об'єкт Timestamp у мілісекунди для сортування
              const tA = a.timestamp?.seconds
                ? a.timestamp.seconds * 1000
                : new Date(a.date).getTime();
              const tB = b.timestamp?.seconds
                ? b.timestamp.seconds * 1000
                : new Date(b.date).getTime();
              return tA - tB;
            })
            .map((item: any) => {
              // convert time for display
              const dateSource = item.timestamp?.seconds
                ? new Date(item.timestamp.seconds * 1000)
                : new Date(item.timestamp || item.date);

              return {
                name: dateSource.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                value:
                  typeof item[parameter] !== 'undefined'
                    ? Number(item[parameter])
                    : 0,
                date: item.date,
              };
            });
        }
        // --- ОБРОБКА ТИЖНЯ ---
        //  "week" dataKey="name"  date
        else if (period === 'week') {
          const dailyStats: Record<
            string,
            { sum: number; count: number; fullDate: string }
          > = {};
          const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

          historyItems.forEach((item: any) => {
            const dateObj = item.date
              ? new Date(item.date)
              : new Date(item.timestamp);
            const dayKey = daysOfWeek[dateObj.getDay()];
            const fullDateString =
              item.date || dateObj.toISOString().split('T')[0]; // Формат "YYYY-MM-DD"

            if (!dailyStats[dayKey]) {
              dailyStats[dayKey] = {
                sum: 0,
                count: 0,
                fullDate: fullDateString,
              };
            }
            dailyStats[dayKey].sum += Number(item[parameter]) || 0;
            dailyStats[dayKey].count += 1;
            // Оновлюємо fullDate, якщо timestamp свіжий
            dailyStats[dayKey].fullDate = fullDateString;
          });

          const today = new Date();
          // Генеруємо 7 днів назад від сьогодні, щоб охопити поточний тиждень
          formattedChartData = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(today.getDate() - (6 - i)); // від 6 днів назад до сьогодні
            const dayKey = daysOfWeek[date.getDay()];
            const stats = dailyStats[dayKey];

            return {
              name: dayKey, // "Sun", "Mon"
              value: stats ? Math.round(stats.sum / stats.count) : 0,
              date: stats ? stats.fullDate : date.toISOString().split('T')[0], // "YYYY-MM-DD"
            };
          });
        }

        // --- mount transform ---
        // For "month" dataKey="name"
        else if (period === 'month') {
          const monthlyStats: Record<
            string,
            { sum: number; count: number; fullDate: string }
          > = {};

          historyItems.forEach((item: any) => {
            let dayNumber = '';
            let fullDateString = '';

            if (item.date) {
              dayNumber = parseInt(item.date.split('-')[2], 10).toString();
              fullDateString = item.date;
            } else {
              const dateObj = new Date(item.timestamp);
              dayNumber = dateObj.getDate().toString();
              fullDateString = dateObj.toISOString().split('T')[0];
            }

            if (!monthlyStats[dayNumber]) {
              monthlyStats[dayNumber] = {
                sum: 0,
                count: 0,
                fullDate: fullDateString,
              };
            }
            monthlyStats[dayNumber].sum += Number(item[parameter]) || 0;
            monthlyStats[dayNumber].count += 1;
            monthlyStats[dayNumber].fullDate = fullDateString; // full date
          });

          const now = new Date();
          const daysInMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0
          ).getDate();

          formattedChartData = Array.from({ length: daysInMonth }, (_, i) => {
            const dayKey = (i + 1).toString();
            const stats = monthlyStats[dayKey];

            // object null
            const dateForDay = new Date(
              now.getFullYear(),
              now.getMonth(),
              i + 1
            );
            const fullDate = dateForDay.toISOString().split('T')[0];

            return {
              name: dayKey, // "1", "2", ... "30"
              value: stats ? Math.round(stats.sum / stats.count) : 0,
              date: stats?.fullDate || fullDate, // "YYYY-MM-DD"
            };
          });
        }
        console.log('formattedChartData:', formattedChartData);
        setChartData(formattedChartData);
      } else {
        console.log('No history items found');
        setChartData([]);
      }
    } catch (err: any) {
      console.error('Error fetching chart data:', err);
      setError(err?.message || 'Failed to fetch data');
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }, [get, parameter, period]);

  useEffect(() => {
    fetchAndProcessData();
  }, [fetchAndProcessData]);

  return { chartData, loading, error, refetch: fetchAndProcessData };
};
