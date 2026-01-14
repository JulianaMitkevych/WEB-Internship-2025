'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { ROUTES } from '@/utils/constants';
import { useStorage } from '@/hooks/useStorage';
import { useApi } from '@/hooks/useApi';
import { useTheme } from '@/hooks/useTheme';
import { EGrowthStatus } from '@/types/types';

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

  const [selectedStartDate, setSelectedStartDate] = useState<
    Date | undefined
  >();
  const [selectedDays, setSelectedDays] = useState<number>(21);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // initial state
  useEffect(() => {
    if (store.user?.startDate) {
      // initial date
      setSelectedStartDate(new Date(store.user.startDate));
    }
    if (store.user?.expectedDays) {
      setSelectedDays(store.user.expectedDays);
    }
  }, [store.user]);

  const handleSave = async () => {
    if (!store.user) return;

    // use selectedStartDate if chosed,or  carrent date user
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
    <>
      <div
        className={`min-h-screen ${themeClasses.background} flex flex-col max-w-[768px] mx-auto`}
      >
        <div className="max-w-md mx-auto w-full px-6 py-8 flex flex-col min-h-screen">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center relative mb-4">
              <button
                onClick={() => router.back()}
                className="absolute left-0 p-1 -ml-1 hover:bg-transparent hover:opacity-70 transition-opacity active:scale-95"
                aria-label="Go back"
              >
                <ChevronLeft
                  className={`size-7 sm:size-8 ${themeClasses.textPrimary}`}
                />
              </button>

              <h1
                className={`text-[28px] font-bold ${themeClasses.textPrimary} leading-tight`}
              >
                {store.user?.startDate
                  ? 'Change Growth Period'
                  : 'Set Growth Period'}
              </h1>
            </div>

            <p
              className={`text-center mt-2 text-sm max-w-xs mx-auto ${themeClasses.textSecondary}`}
            >
              {store.user?.startDate
                ? 'Update when to start growing and how long it will take'
                : 'Select the date when you want to start growing and choose how many days the growth period will last'}
            </p>
          </div>

          <div className="flex flex-col flex-grow space-y-6">
            {/* date */}
            {(() => {
              const userStartDate = store.user?.startDate
                ? new Date(store.user.startDate)
                : null;
              const now = new Date();
              const growthStarted = userStartDate && now >= userStartDate;

              return growthStarted ? (
                /*\only read*/
                <div className="space-y-3">
                  <label
                    className={`text-lg font-semibold ${themeClasses.textPrimary} flex items-center gap-2`}
                  >
                    <CalendarIcon className="w-5 h-5" />
                    Start Date (Cannot be changed)
                  </label>

                  <div
                    className={`${themeClasses.cardBackground} rounded-[12px] ${themeClasses.border} p-4 ${themeClasses.shadow}`}
                  >
                    <div className="text-center">
                      <p
                        className={`text-lg font-semibold ${themeClasses.textPrimary}`}
                      >
                        {format(new Date(store.user.startDate), 'PPP')}
                      </p>
                      <p className={`text-xs mt-1 ${themeClasses.textMuted}`}>
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
                /* choose */
                <div className="space-y-3">
                  <label
                    className={`text-lg font-semibold ${themeClasses.textPrimary} flex items-center gap-2`}
                  >
                    <CalendarIcon className="w-5 h-5" />
                    Start Date
                  </label>

                  <div
                    className={`${themeClasses.cardBackground} rounded-[12px] ${themeClasses.border} p-4 mb-6 ${themeClasses.shadow}`}
                  >
                    <Calendar
                      mode="single"
                      selected={selectedStartDate}
                      onSelect={setSelectedStartDate}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const checkDate = new Date(date);
                        checkDate.setHours(0, 0, 0, 0);

                        //if grow start forbit choose date
                        const userStartDate = store.user?.startDate
                          ? new Date(store.user.startDate)
                          : null;
                        const now = new Date();

                        if (userStartDate && now >= userStartDate) {
                          return true;
                        }

                        // grow day not starn user can change date
                        return checkDate < today;
                      }}
                      className="mx-auto"
                    />
                  </div>

                  <div className="bg-[#D5E3CC] border border-[#2F7302] rounded-[12px] p-3 mb-4 ">
                    <p className="text-sm text-[#2F7302]">
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
                      <p className={`text-sm ${themeClasses.textSecondary}`}>
                        Selected: {format(selectedStartDate, 'PPP')}
                      </p>
                      <p className={`text-xs mt-1 ${themeClasses.textMuted}`}>
                        Growth will start on this date
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* select quantity date */}
            <div className="space-y-3">
              <label
                className={`text-lg font-semibold ${themeClasses.textPrimary}`}
              >
                Growth Duration (days)
              </label>
              <p className={`text-sm mt-1 ${themeClasses.textSecondary}`}>
                How many days from the start date until harvest
              </p>

              <div
                className={`${themeClasses.cardBackground} rounded-[12px] border p-4`}
              >
                <div className="grid grid-cols-3 gap-3">
                  {[14, 21, 28, 30, 35, 42].map((days) => (
                    <button
                      key={days}
                      onClick={() => setSelectedDays(days)}
                      className={`p-3 rounded-[12px] border text-center transition-colors ${
                        selectedDays === days
                          ? ' text-white  bg-gradient-to-b from-[#53C904] to-[#2F7302] hover:from-[#2F7302] hover:to-[#53C904] focus:from-[#2F7302] focus:to-[#53C904]'
                          : `${themeClasses.cardBackground} border-gray-300 hover:border-[#53C904] ${themeClasses.textPrimary}`
                      }`}
                    >
                      {days}
                    </button>
                  ))}
                </div>
              </div>

              {/* casto quantity date */}
              <div className="mt-4">
                <label
                  className={`text-sm block mb-2 ${themeClasses.textSecondary}`}
                >
                  Custom duration:
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={selectedDays}
                  onChange={(e) => setSelectedDays(Number(e.target.value))}
                  className={`w-full p-3 border rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#53C904] focus:border-transparent ${themeClasses.cardBackground} ${themeClasses.textPrimary}`}
                  placeholder="Enter days"
                />
              </div>
            </div>

            {/* info */}
            {expectedHarvestDate && selectedStartDate && (
              <div
                className={`p-4 rounded-[12px] ${themeClasses.cardBackground} border`}
              >
                <h3
                  className={`font-semibold ${themeClasses.textPrimary} mb-2`}
                >
                  Growth Timeline
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={themeClasses.textSecondary}>
                      Start date:
                    </span>
                    <span className={`${themeClasses.textPrimary} font-medium`}>
                      {format(selectedStartDate, 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={themeClasses.textSecondary}>
                      Duration:
                    </span>
                    <span className={`${themeClasses.textPrimary} font-medium`}>
                      {selectedDays} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={themeClasses.textSecondary}>
                      Harvest date:
                    </span>
                    <span className={`${themeClasses.textPrimary} font-medium`}>
                      {format(expectedHarvestDate, 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* save */}
          <div className="mt-auto pt-6 flex justify-center">
            <Button
              type="button"
              variant="gradient"
              onClick={handleSave}
              disabled={loading || !canSave}
              className="w-full max-w-[327px] h-12 text-base font-semibold text-white bg-gradient-to-b from-[#53C904] to-[#2F7302] hover:from-[#2F7302] hover:to-[#53C904] focus:from-[#2F7302] focus:to-[#53C904] rounded-2xl transition-all disabled:opacity-50"
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
    </>
  );
}
