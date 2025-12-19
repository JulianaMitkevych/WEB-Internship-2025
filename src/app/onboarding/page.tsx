// app/onboarding/page.tsx

import OnboardingStepper from '@/components/onboarding/OnboardingStepper';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen">
      <OnboardingStepper />
    </div>
  );
}


// Ця Server Action обробляє завершення онбордингу


  // 1. потрібно оновити статус користувача в базі даних
  // (наприклад,Firestore) на onboardingComplete: true
  // Приклад: await updateUserOnboardingStatus(userId, true);

  // 2. Перенаправлення на потік підключення пристрою

  // redirect(ROUTES.DEVICE_CONNECT);
  // 🚧 TODO: Розкоментувати цей рядок, коли сторінка підключення пристрою буде готова.

  // Тимчасовий fallback: перенаправляємо на Дашборд