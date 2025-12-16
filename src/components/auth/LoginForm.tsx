'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Check, Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { PlantIcon } from '@/assets/svg/PlantIcon';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useApi } from '@/hooks/useApi';
import { useStorage } from '@/hooks/useStorage';
import { LogInFormValues, LogInSchema } from '@/lib/zod-schemas';
import { ROUTES } from '@/utils';
import { UserWithoutCropType } from '@/context/types';
import { auth } from '@/lib/firebase/client';

type LoginResponse = {
  user: Partial<UserWithoutCropType> & { id: string; email: string | null };
  token: string;
};

const LoginForm = () => {
  const router = useRouter();
  const form = useForm<LogInFormValues>({
    resolver: zodResolver(LogInSchema),
    defaultValues: {
      email: 'nick.name@mail.com',
      password: '',
    },
    mode: 'onTouched',
  });
  const [, setStore] = useStorage();
  const { post, error, loading } = useApi<LoginResponse>();

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const emailValue = form.watch('email');
  const showEmailCheck =
    !!emailValue &&
    form.formState.touchedFields.email &&
    !form.formState.errors.email;

  const onSubmit = async (values: LogInFormValues) => {
    setAuthError(null);
    try {
      // First, authenticate with Firebase to get the idToken
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      const idToken = await userCredential.user.getIdToken();

      // Then send the idToken to the backend to create a session cookie
      const response = await post(ROUTES.API.AUTH.LOGIN, { idToken });

      if (response?.user) {
        const normalizedUser: UserWithoutCropType = {
          id: response.user.id,
          email: response.user.email ?? null,
          firstName: response.user.firstName ?? null,
          lastName: response.user.lastName ?? null,
          phoneNumber: response.user.phoneNumber ?? null,
          createdAt: response.user.createdAt ?? null,
        };
        setStore((prev) => ({ ...prev, user: normalizedUser }));
      }

      router.push(ROUTES.ONBOARDING);
    } catch (error: any) {
      // Handle Firebase auth errors
      if (error?.code?.startsWith('auth/')) {
        const errorMessages: Record<string, string> = {
          'auth/user-not-found': 'No account found with this email.',
          'auth/wrong-password': 'Incorrect password.',
          'auth/invalid-email': 'Invalid email address.',
          'auth/user-disabled': 'This account has been disabled.',
          'auth/too-many-requests':
            'Too many failed attempts. Please try again later.',
          'auth/invalid-credential': 'Invalid email or password.',
        };

        const errorMessage =
          errorMessages[error.code] ??
          'Authentication failed. Please try again.';
        setAuthError(errorMessage);
      }
      // API errors are handled by useApi hook state
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="mx-auto w-full max-w-lg flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-[0px_14px_50px_rgba(0,0,0,0.08)]">
          <div className="mb-8 text-center">
            <div className="grid place-items-center mb-6">
              <PlantIcon size={50} />
            </div>
            <h1 className="text-3xl font-bold text-night-sky">Welcome back</h1>
            <p className="mt-2 text-base text-grey-x-dark">
              Sign in to grow your plants
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm text-grey-x-dark">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="nick.name@mail.com"
                          className="h-12 rounded-xl border border-[#2F9E44] border-opacity-70 bg-white pr-10 text-night-sky focus-visible:ring-0 focus-visible:border-[#2F9E44]"
                          {...field}
                        />
                        {showEmailCheck && (
                          <Check
                            className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#2F9E44]"
                            aria-hidden
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm text-grey-x-dark">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="h-12 rounded-xl border border-[#2F9E44] border-opacity-70 bg-white pr-10 text-night-sky focus-visible:ring-0 focus-visible:border-[#2F9E44]"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2F9E44]"
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(error || authError) && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {authError || error}
                </div>
              )}

              <Button
                type="submit"
                variant="gradient"
                className="w-full text-base rounded-2xl"
                disabled={loading || !form.formState.isValid}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-grey-x-dark">
            Don`t have an account?&nbsp;
            <Link
              href={ROUTES.REGISTER}
              className="font-semibold text-[#2F9E44]"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
