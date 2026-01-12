'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { ROUTES } from '@/utils/constants';
import { useStorage } from '@/hooks/useStorage';
import { useApi } from '@/hooks/useApi';
import { useTheme } from '@/hooks/useTheme';
import { EGrowthStatus } from '@/types/types';
import 'react-day-picker/dist/style.css';

type UpdateGrowthDateResponse = {
  message: string;
  startDate: string;
  expectedDays: number;
  status: EGrowthStatus;
  isNewSetup: boolean;
};

export default function SetGrowthDatePage() {
  const router = useRouter();
  const [store, setStore] = useStorage();
  const { post, loading } = useApi<UpdateGrowthDateResponse>();
  const { classes: themeClasses } = useTheme();

  // Стан для вибору дати початку
  const [selectedStartDate, setSelectedStartDate] = useState<
    Date | undefined
  >();
  // Стан для вибору кількості днів
  const [selectedDays, setSelectedDays] = useState<number>(21);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Якщо користувач вже має встановлену дату початку, ініціалізуємо стан
  useEffect(() => {
    if (store.user?.startDate) {
      // Для існуючого вирощування - ініціалізуємо поточну дату початку
      setSelectedStartDate(new Date(store.user.startDate));
    }
    if (store.user?.expectedDays) {
      setSelectedDays(store.user.expectedDays);
    }
  }, [store.user]);

  const handleSave = async () => {
    if (!store.user) return;

    // Використовуємо selectedStartDate якщо він вибраний, інакше поточну дату користувача
    const startDateToSave =
      selectedStartDate ||
      (store.user.startDate ? new Date(store.user.startDate) : null);
    if (!startDateToSave) return;

    try {
      const response = await post('/api/auth/update-growth-date', {
        startDate: startDateToSave.toISOString(),
        expectedDays: selectedDays,
        status:
          store.user.status === EGrowthStatus.SETUP
            ? EGrowthStatus.GROWING
            : store.user.status,
      });

      // Оновлюємо стан користувача
      setStore((prev) => ({
        ...prev,
        user: prev.user
          ? {
              ...prev.user,
              startDate: response.startDate,
              expectedDays: response.expectedDays,
              status: response.status,
              growthDay: response.isNewSetup ? 1 : prev.user.growthDay,
              totalGrowthDays: response.expectedDays,
            }
          : null,
      }));

      // Повертаємося на dashboard
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      console.error('Failed to update growth date:', err);
    }
  };

  const canSave =
    (selectedStartDate || store.user?.startDate) && selectedDays > 0;

  if (!mounted) return null;

  const expectedHarvestDate = selectedStartDate
    ? addDays(selectedStartDate, selectedDays)
    : null;

  return (
    <div className={`min-h-screen ${themeClasses.background} flex flex-col`}>
      <div className="max-w-md mx-auto w-full px-6 py-8 flex flex-col min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 p-1 -ml-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft
              className={`size-7 sm:size-8 ${themeClasses.textPrimary}`}
            />
          </button>

          <h1
            className={`text-[28px] text-center font-bold ${themeClasses.textPrimary} leading-tight`}
          >
            {store.user?.startDate
              ? 'Change Growth Period'
              : 'Set Growth Period'}
          </h1>

          <p className="text-center text-gray-600 mt-2 text-sm max-w-xs mx-auto">
            {store.user?.startDate
              ? 'Update when to start growing and how long it will take'
              : 'Select the date when you want to start growing and choose how many days the growth period will last'}
          </p>
        </div>

        <div className="flex flex-col flex-grow space-y-6">
          {/* Вибір дати початку */}
          {(() => {
            const userStartDate = store.user?.startDate
              ? new Date(store.user.startDate)
              : null;
            const now = new Date();
            const growthStarted = userStartDate && now >= userStartDate;

            return growthStarted ? (
              /* Режим зміни існуючого вирощування - тільки читання дати початку */
              <div className="space-y-3">
                <label
                  className={`text-lg font-semibold ${themeClasses.textPrimary} flex items-center gap-2`}
                >
                  <CalendarIcon className="w-5 h-5" />
                  Start Date (Cannot be changed)
                </label>

                <div className="bg-gray-50 rounded-[12px] border p-4 shadow-sm">
                  <div className="text-center">
                    <p
                      className={`text-lg font-semibold ${themeClasses.textPrimary}`}
                    >
                      {format(new Date(store.user.startDate), 'PPP')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Growth started on this date • Cannot be modified
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-[12px] p-3">
                  <p className="text-sm text-yellow-800">
                    <span className="font-semibold">Note:</span> You can only
                    change the growth duration. The start date cannot be
                    modified once growth has begun.
                  </p>
                </div>
              </div>
            ) : (
              /* Режим зміни дати або першого налаштування - можна вибирати дату */
              <div className="space-y-3">
                <label
                  className={`text-lg font-semibold ${themeClasses.textPrimary} flex items-center gap-2`}
                >
                  <CalendarIcon className="w-5 h-5" />
                  Start Date
                </label>

                <div className="bg-white rounded-[12px] border p-4 shadow-sm">
                  <DayPicker
                    mode="single"
                    selected={selectedStartDate}
                    onSelect={setSelectedStartDate}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0); // скидаємо час для порівняння тільки дат
                      const checkDate = new Date(date);
                      checkDate.setHours(0, 0, 0, 0);

                      // Якщо вирощування ще не почалося, дозволяємо обирати від сьогоднішньої дати
                      // Якщо вирощування вже почалося, забороняємо змінювати дату взагалі
                      const userStartDate = store.user?.startDate
                        ? new Date(store.user.startDate)
                        : null;
                      const now = new Date();

                      if (userStartDate && now >= userStartDate) {
                        // Вирощування вже почалося - не дозволяємо змінювати дату
                        return true;
                      }

                      // Вирощування ще не почалося - дозволяємо обирати від сьогоднішньої дати
                      return checkDate < today;
                    }}
                    className="mx-auto"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-[12px] p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Note:</span>{' '}
                    {(() => {
                      const userStartDate = store.user?.startDate
                        ? new Date(store.user.startDate)
                        : null;
                      const now = new Date();

                      if (userStartDate && now >= userStartDate) {
                        return 'Growth has already started. You cannot change the start date.';
                      }
                      return "Past dates are disabled. You can select today's date or any future date for growth start.";
                    })()}
                  </p>
                </div>

                {selectedStartDate && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Selected: {format(selectedStartDate, 'PPP')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Growth will start on this date
                    </p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Вибір кількості днів */}
          <div className="space-y-3">
            <label
              className={`text-lg font-semibold ${themeClasses.textPrimary}`}
            >
              Growth Duration (days)
            </label>
            <p className="text-sm text-gray-600 mt-1">
              How many days from the start date until harvest
            </p>

            <div className="bg-white rounded-[12px] border p-4">
              <div className="grid grid-cols-3 gap-3">
                {[14, 21, 28, 30, 35, 42].map((days) => (
                  <button
                    key={days}
                    onClick={() => setSelectedDays(days)}
                    className={`p-3 rounded-[12px] border text-center transition-colors ${
                      selectedDays === days
                        ? ' text-white  bg-gradient-to-b from-[#53C904] to-[#2F7302] hover:from-[#2F7302] hover:to-[#53C904] focus:from-[#2F7302] focus:to-[#53C904]'
                        : 'bg-white border-gray-300 hover:border-[#53C904]'
                    }`}
                  >
                    {days}
                  </button>
                ))}
              </div>
            </div>

            {/* Кастомний ввод */}
            <div className="mt-4">
              <label className="text-sm text-gray-600 block mb-2">
                Custom duration:
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={selectedDays}
                onChange={(e) => setSelectedDays(Number(e.target.value))}
                className="w-full p-3 border rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#53C904] focus:border-transparent"
                placeholder="Enter days"
              />
            </div>
          </div>

          {/* Інформація про очікувану дату збору */}
          {expectedHarvestDate && selectedStartDate && (
            <div
              className={`p-4 rounded-[12px] ${themeClasses.cardBackground} border`}
            >
              <h3 className={`font-semibold ${themeClasses.textPrimary} mb-2`}>
                Growth Timeline
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start date:</span>
                  <span className={`${themeClasses.textPrimary} font-medium`}>
                    {format(selectedStartDate, 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className={`${themeClasses.textPrimary} font-medium`}>
                    {selectedDays} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Harvest date:</span>
                  <span className={`${themeClasses.textPrimary} font-medium`}>
                    {format(expectedHarvestDate, 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Кнопка збереження */}
        <div className="mt-auto pt-6 flex justify-center">
          <Button
            type="button"
            variant="gradient"
            onClick={handleSave}
            disabled={loading || !canSave}
            className="w-full max-w-[327px] h-12 text-base font-semibold text-white bg-gradient-to-b from-[#53C904] to-[#2F7302] hover:from-[#2F7302] hover:to-[#53C904] focus:from-[#2F7302] focus:to-[#53C904] rounded-2xl shadow-md transition-all disabled:opacity-50"
          >
            {loading
              ? 'Saving...'
              : store.user?.startDate
                ? 'Update Growth Settings'
                : 'Start Growing'}
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="profile" />
    </div>
  );
}
