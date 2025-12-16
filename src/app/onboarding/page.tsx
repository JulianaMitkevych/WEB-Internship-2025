// app/onboarding/page.tsx

import { redirect } from 'next/navigation';
import { ROUTES } from '@/utils/constants';
import OnboardingStepper from '@/components/onboarding/OnboardingStepper';

// Ця Server Action обробляє завершення онбордингу
const handleFinish = async () => {
  'use server';

  // 1. потрібно оновити статус користувача в базі даних
  // (наприклад,Firestore) на onboardingComplete: true
  // Приклад: await updateUserOnboardingStatus(userId, true);

  // 2. Перенаправлення на потік підключення пристрою

  // redirect(ROUTES.DEVICE_CONNECT);
  // 🚧 TODO: Розкоментувати цей рядок, коли сторінка підключення пристрою буде готова.

  // Тимчасовий fallback: перенаправляємо на Дашборд
  redirect(ROUTES.DASHBOARD);
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen">
      {/* onFinish викличе Server Action, коли юзер натисне Skip або Next на останньому кроці */}
      <OnboardingStepper onFinish={handleFinish} />
    </div>
  );
}
