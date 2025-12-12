'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Check, Eye, EyeOff } from 'lucide-react';

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

type LoginResponse = {
  user: Partial<UserWithoutCropType> & { id: string; email: string | null };
  token: string;
};

const LoginForm = () => {
  const router = useRouter();
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

  const emailValue = form.watch('email');
  const showEmailCheck =
    !!emailValue &&
    form.formState.touchedFields.email &&
    !form.formState.errors.email;

  const onSubmit = async (values: LogInFormValues) => {
    try {
      const response = await post(ROUTES.API.AUTH.LOGIN, values);

      if (response?.user) {
        const normalizedUser: UserWithoutCropType = {
          id: response.user.id,
          email: response.user.email ?? null,
          firstName: response.user.firstName ?? null,
          lastName: response.user.lastName ?? null,
          phoneNumber: response.user.phoneNumber ?? null,
        };
        setStore((prev) => ({ ...prev, user: normalizedUser }));
      }

      router.push(ROUTES.HOME);
    } catch {
      // handled by hook state
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0px_14px_50px_rgba(0,0,0,0.08)]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#EEF7EC] text-2xl">
              🌱
            </div>
            <h1 className="text-3xl font-bold text-night-sky">Welcome back</h1>
            <p className="mt-2 text-base text-grey-x-dark">
              Sign in to grow your plants
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-night-sky">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="nick.name@mail.com"
                          className="h-12 rounded-xl border-2 border-[#4CAF50]/60 bg-white pr-12 text-night-sky"
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
                  <FormItem>
                    <FormLabel className="text-sm text-night-sky">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="•••••••••••"
                          className="h-12 rounded-xl border-2 border-[#4CAF50]/60 bg-white pr-12 text-night-sky"
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

              {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="h-12 w-full rounded-xl bg-gradient-to-r from-[#3FB44A] to-[#209123] text-base font-semibold text-white shadow-md hover:brightness-105"
                disabled={loading || !form.formState.isValid}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-grey-x-dark">
            Don`t have an account?
            <Link
              href={ROUTES.REGISTER}
              className="font-semibold h-[48px] rounded-[20px]  text-[#2F9E44] max-w-[327px] text-center leading-[48px]"
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
