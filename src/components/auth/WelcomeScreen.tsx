'use client';

import { useRouter } from 'next/navigation';
import { PlantIcon } from '@/assets/svg/PlantIcon';
import { ROUTES } from '@/utils';
import { useTheme } from '@/hooks/useTheme';

const WelcomeScreen = () => {
  const router = useRouter();
  const { classes: themeClasses } = useTheme();

  const handleGoToAuth = () => {
    router.push(ROUTES.LOGIN);
  };

  return (
    <div className={`max-w-[768px]  mx-auto flex min-h-screen items-center justify-center ${themeClasses.background}`}>
      <div className="flex flex-col items-center justify-center text-center px-6">
        <div
          role="button"
          onClick={handleGoToAuth}
          className="cursor-pointer transition duration-150 hover:scale-105"
          aria-label="Continue to login"
        >
          <PlantIcon size={84} />
        </div>

        <h1 className={`mt-10 text-3xl font-bold md:text-4xl ${themeClasses.textPrimary}`}>
          Welcome to App
        </h1>
      </div>
    </div>
  );
};

export default WelcomeScreen;
