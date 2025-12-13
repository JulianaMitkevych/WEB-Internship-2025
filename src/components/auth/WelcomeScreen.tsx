'use client';

import { useRouter } from 'next/navigation';
import { PlantIcon } from '@/assets/svg/PlantIcon';
import { ROUTES } from '@/utils';

const WelcomeScreen = () => {
  const router = useRouter();

  const handleGoToAuth = () => {
    router.push(ROUTES.LOGIN);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center text-center px-6">
        <div
          role="button"
          onClick={handleGoToAuth}
          className="cursor-pointer transition duration-150 hover:scale-105"
          aria-label="Continue to login"
        >
          <PlantIcon size={84} />
        </div>

        <h1 className="mt-8 text-3xl font-bold text-night-sky md:text-4xl">
          Welcome to App
        </h1>
      </div>
    </div>
  );
};

export default WelcomeScreen;
