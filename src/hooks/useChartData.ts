
// import { useState, useEffect, useCallback } from 'react';
// import { useApi } from './useApi';
// import { TChartPeriod } from '@/types/types';

// interface ChartDataItem {
//   name: string;
//   value: number;
// }

// interface UseChartDataOptions {
//   parameter: string;
//   period: TChartPeriod;
// }

// export const useChartData = ({ parameter, period }: UseChartDataOptions) => {
//   const { get } = useApi<any>();
//   const [chartData, setChartData] = useState<ChartDataItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchAndProcessData = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await get(
//         `/api/settings/history?period=${period}&parameter=${parameter}`
//       );

//       const incomingData = response?.data || response;
//       const historyItems = Array.isArray(incomingData?.data)
//         ? incomingData.data
//         : [];

//       if (historyItems.length > 0) {
//         let formattedChartData: ChartDataItem[] = [];

//         if (period === 'day') {
//           formattedChartData = historyItems
//             .sort(
//               (a: any, b: any) =>
//                 new Date(a.timestamp).getTime() -
//                 new Date(b.timestamp).getTime()
//             )
//             .map((item: any) => ({
//               name: new Date(item.timestamp).toLocaleTimeString([], {
//                 hour: '2-digit',
//                 minute: '2-digit',
//               }),
//               value: Number(item[parameter]) || 0,
//             }));
//         } else if (period === 'week') {
//           const dailyData: { [key: string]: { sum: number; count: number } } =
//             {};
//           const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//           historyItems.forEach((item: any) => {
//             const date = new Date(item.timestamp);
//             const dayKey = daysOfWeek[date.getDay()];
//             if (!dailyData[dayKey]) dailyData[dayKey] = { sum: 0, count: 0 };
//             dailyData[dayKey].sum += Number(item[parameter]) || 0;
//             dailyData[dayKey].count += 1;
//           });

//           const today = new Date();
//           formattedChartData = Array.from({ length: 7 }, (_, i) => {
//             const date = new Date();
//             date.setDate(today.getDate() - (6 - i));
//             const dayKey = daysOfWeek[date.getDay()];
//             const stats = dailyData[dayKey];
//             return {
//               name: dayKey,
//               value: stats ? Math.round(stats.sum / stats.count) : 0,
//             };
//           });
//         } else if (period === 'month') {
//           const dailyData: { [key: string]: { sum: number; count: number } } =
//             {};
//           historyItems.forEach((item: any) => {
//             const dayOfMonth = new Date(item.timestamp).getDate().toString();
//             if (!dailyData[dayOfMonth])
//               dailyData[dayOfMonth] = { sum: 0, count: 0 };
//             dailyData[dayOfMonth].sum += Number(item[parameter]) || 0;
//             dailyData[dayOfMonth].count += 1;
//           });

//           const now = new Date();
//           const daysInMonth = new Date(
//             now.getFullYear(),
//             now.getMonth() + 1,
//             0
//           ).getDate();

//           formattedChartData = Array.from({ length: daysInMonth }, (_, i) => {
//             const dayKey = (i + 1).toString();
//             const stats = dailyData[dayKey];
//             return {
//               name: dayKey,
//               value: stats ? Math.round(stats.sum / stats.count) : 0,
//             };
//           });
//         }
//         setChartData(formattedChartData);
//       } else {
//         setChartData([]);
//       }
//     } catch (err: any) {
//       console.error('Error fetching chart data:', err?.message || err);
//       setError(err?.message || 'Failed to fetch data from database');
//       setChartData([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [get, parameter, period]);

//   useEffect(() => {
//     fetchAndProcessData();
//   }, [fetchAndProcessData]);

//   return { chartData, loading, error };
// };
import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { TChartPeriod } from '@/types/types';

interface ChartDataItem {
  name: string;
  value: number;
  date?: string; // Додаємо поле date для SmartChart
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

      const incomingData = response?.data || response;
      const historyItems = Array.isArray(incomingData?.data) ? incomingData.data : [];

      if (historyItems.length > 0) {
        let formattedChartData: ChartDataItem[] = [];

        // --- ОБРОБКА ДЕННОГО ПЕРІОДУ ---
        if (period === 'day') {
          formattedChartData = historyItems
            .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .map((item: any) => ({
              name: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              value: Number(item[parameter]) || 0,
            }));
        } 
        
        // --- ОБРОБКА ТИЖНЯ ---
        else if (period === 'week') {
          const dailyStats: Record<string, { sum: number; count: number; fullDate: string }> = {};
          const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

          historyItems.forEach((item: any) => {
            // Пріоритет: якщо timestamp однаковий, Date об'єкт з поля item.date (напр. "2025-12-04") буде точнішим
            const dateObj = item.date ? new Date(item.date) : new Date(item.timestamp);
            const dayKey = daysOfWeek[dateObj.getDay()];
            
            if (!dailyStats[dayKey]) {
              dailyStats[dayKey] = { sum: 0, count: 0, fullDate: item.date || dateObj.toLocaleDateString() };
            }
            dailyStats[dayKey].sum += Number(item[parameter]) || 0;
            dailyStats[dayKey].count += 1;
          });

          const today = new Date();
          formattedChartData = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(today.getDate() - (6 - i));
            const dayKey = daysOfWeek[date.getDay()];
            const stats = dailyStats[dayKey];
            
            return {
              name: dayKey,
              value: stats ? Math.round(stats.sum / stats.count) : 0,
              date: stats ? stats.fullDate : date.toLocaleDateString() // Передаємо дату для SmartChart
            };
          });
        } 
        
        // --- ОБРОБКА МІСЯЦЯ ---
        else if (period === 'month') {
          const monthlyStats: Record<string, { sum: number; count: number; fullDate: string }> = {};
          
          historyItems.forEach((item: any) => {
            // Витягуємо число місяця (з "2025-12-04" отримуємо "4")
            let dayNumber = "";
            if (item.date) {
              dayNumber = parseInt(item.date.split('-')[2], 10).toString();
            } else {
              dayNumber = new Date(item.timestamp).getDate().toString();
            }

            if (!monthlyStats[dayNumber]) {
              monthlyStats[dayNumber] = { sum: 0, count: 0, fullDate: item.date || "" };
            }
            monthlyStats[dayNumber].sum += Number(item[parameter]) || 0;
            monthlyStats[dayNumber].count += 1;
          });

          const now = new Date();
          const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

          formattedChartData = Array.from({ length: daysInMonth }, (_, i) => {
            const dayKey = (i + 1).toString();
            const stats = monthlyStats[dayKey];
            return {
              name: dayKey,
              value: stats ? Math.round(stats.sum / stats.count) : 0,
              date: stats?.fullDate || ""
            };
          });
        }
        setChartData(formattedChartData);
      } else {
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

  return { chartData, loading, error };
};