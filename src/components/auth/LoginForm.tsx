
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Check, Eye, EyeOff, TriangleAlert } from 'lucide-react';
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
import { useTheme } from '@/hooks/useTheme';
import { LogInFormValues, LogInSchema } from '@/lib/zod-schemas';
import { ROUTES } from '@/utils';
import { TUser } from '@/types/types';
import { auth } from '@/lib/firebase/client';

type LoginResponse = {
  user: Partial<TUser> & { id: string; email: string | null };
  token: string;
};

const inputStyles = (isDark: boolean, themeClasses: any) =>
  `h-12 rounded-xl border-2 border-[#4CAF50]/60 ${isDark ? 'bg-[#2E2E2E]' : 'bg-white'} pr-12 ${themeClasses.textPrimary}`;

const LoginForm = () => {
  const router = useRouter();
  const { classes: themeClasses, isDark } = useTheme();
  const form = useForm<LogInFormValues>({
    resolver: zodResolver(LogInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });
  const [, setStore] = useStorage();
  const { post, error, loading } = useApi<LoginResponse>();

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const onSubmit = async (values: LogInFormValues) => {
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      const idToken = await userCredential.user.getIdToken();
      const response = await post(ROUTES.API.AUTH.LOGIN, { idToken });

      if (response?.user) {
        const normalizedUser: TUser = {
          id: response.user.id,
          email: response.user.email ?? null,
          firstName: response.user.firstName ?? null,
          lastName: response.user.lastName ?? null,
          phoneNumber: response.user.phoneNumber ?? null,
          cropType: response.user.cropType ?? null,
          createdAt: response.user.createdAt ?? null,
        };
        setStore((prev) => ({ ...prev, user: normalizedUser }));

        // Redirect to dashboard if user already has crop type selected, otherwise to onboarding
        const redirectRoute = normalizedUser.cropType ? ROUTES.DASHBOARD : ROUTES.ONBOARDING;
        router.push(redirectRoute);
      }
    } catch (error: any) {
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
    }
  };
// icon
  const renderStatusIcon = (fieldName: keyof LogInFormValues) => {
    if (form.formState.errors[fieldName]) {
      return (
        <TriangleAlert
          className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#EB5757]"
          aria-hidden
        />
      );
    }

    const value = form.watch(fieldName);
    const isTouched = form.formState.touchedFields[fieldName];

    if (fieldName === 'email' && !!value && isTouched) {
      return (
        <Check className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#2F9E44]" />
      );
    }

    return null;
  };

  return (
    <div className={`h-screen ${isDark ? 'bg-[#2E2E2E]' : 'bg-white'} flex items-center justify-center`}>
      <div className="mx-auto w-full max-w-xl flex flex-col items-center justify-center px-6 py-8">
        <div className={`w-full max-w-3xl rounded-2xl ${isDark ? 'bg-[#2E2E2E]' : 'bg-white'} p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]`}>
          <div className="mb-8 text-center">
            <div className="grid place-items-center mb-6">
              <PlantIcon size={65} />
            </div>
            <h1 className={`text-3xl font-bold ${themeClasses.textPrimary}`}>Welcome back</h1>
            <p className="mt-2 text-base  text-[#6D6D6D]">
              Sign in to grow your plants
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm text-night-sky">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="nick.name@mail.com"
                          className={inputStyles(isDark, themeClasses)}
                          aria-invalid={!!fieldState.error}
                          {...field}
                        />
                        {renderStatusIcon('email')}
                      </div>
                    </FormControl>
                    <FormMessage className="text-[#EB5757]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm text-night-sky">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className={inputStyles(isDark, themeClasses)}
                          aria-invalid={!!fieldState.error}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2F9E44]"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-[#EB5757]" />
                  </FormItem>
                )}
              />

              {(error || authError) && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-[#EB5757]">
                  {authError || error}
                </div>
              )}

              <Button
                type="submit"
                variant="gradient"
                className="w-full text-base text-white rounded-2xl h-12"
                disabled={loading || !form.formState.isValid}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-grey-x-dark">
            Don&apos;t have an account?&nbsp;
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