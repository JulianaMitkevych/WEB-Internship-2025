'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/utils';

const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7FFF5] to-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col-reverse items-center gap-10 px-6 py-12 md:flex-row md:items-center md:justify-between md:py-16">
        <div className="max-w-xl text-center md:text-left">
          <div
            role="button"
            onClick={() => router.push(ROUTES.REGISTER)}
            className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-[#E9F5E7] text-3xl shadow-sm transition hover:scale-105 md:mx-0"
            aria-label="Go to registration"
          >
            👤
          </div>

          <h1 className="text-4xl font-bold text-night-sky md:text-5xl">
            GrowBox
          </h1>
          <p className="mt-4 text-lg text-grey-x-dark">
            Monitor, automate, and enjoy healthier plants. Create an account to
            personalize your GrowBox experience.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Button
              onClick={() => router.push(ROUTES.REGISTER)}
              className="sm:w-auto"
            >
              Create account
            </Button>
            <Button variant="outline" asChild className="sm:w-auto">
              <Link href={ROUTES.LOGIN}>Log in</Link>
            </Button>
          </div>
        </div>

        <div className="relative h-64 w-full max-w-xl overflow-hidden rounded-3xl bg-[#E9F5E7] shadow-[0px_20px_60px_rgba(0,0,0,0.08)] md:h-96">
          <Image
            src="/vercel.svg"
            alt="GrowBox illustration"
            fill
            className="object-contain p-8"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
