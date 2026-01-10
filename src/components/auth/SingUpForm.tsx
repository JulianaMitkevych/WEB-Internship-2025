
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Check, Eye, EyeOff, TriangleAlert } from 'lucide-react';
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
import { useApi } from '@/hooks/useApi';
import { SignUpFormValues, SignUpSchema } from '@/lib/zod-schemas';
import { ROUTES } from '@/utils/constants';
import { Input } from '@/components/ui/input';
import { useStorage } from '@/hooks/useStorage';

const inputStyles =
  'h-12 rounded-xl border-2 border-[#EB5757]/60 bg-white pr-12 text-[#020202]';

const SignUpForm = () => {
  const router = useRouter();
  const { post, error, loading } = useApi();
  const [store] = useStorage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check if user is already authenticated and redirect accordingly
  useEffect(() => {
    if (store.user) {
      // If user is authenticated but hasn't selected crop type, redirect to onboarding
      if (!store.user.cropType) {
        router.push(ROUTES.ONBOARDING);
      } else {
        // If user is authenticated and has crop type, redirect to dashboard
        router.push(ROUTES.DASHBOARD);
      }
    }
  }, [store.user, router]);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = async (values: SignUpFormValues) => {
    try {
      await post(ROUTES.API.AUTH.SIGN_UP, values);
      router.push(ROUTES.LOGIN);
    } catch {}
  };

  //function check valid
  const shouldShowCheck = (fieldName: keyof SignUpFormValues) => {
    const value = form.watch(fieldName);
    const isTouched = form.formState.touchedFields[fieldName];
    const hasError = !!form.formState.errors[fieldName];
    return !!value && isTouched && !hasError;
  };

  const renderStatusIcon = (fieldName: keyof SignUpFormValues) => {
    if (form.formState.errors[fieldName]) {
      return (
        <TriangleAlert
          className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#EB5757]"
          aria-hidden
        />
      );
    }

    // show check
    if (
      ['firstName', 'lastName', 'email'].includes(fieldName) &&
      shouldShowCheck(fieldName)
    ) {
      return (
        <Check className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#2F9E44]" />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-white overflow-y-auto md:overflow-y-visible">
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-[0_14px_50px_rgba(0,0,0,0.08)]">
          <div className="mb-8 text-center">
            <div className="grid place-items-center mb-6">
              <PlantIcon size={65} />
            </div>
            <h1 className="text-3xl font-bold text-[#020202]">
              Create an account
            </h1>
            <p className="mt-2 text-base text-[#6D6D6D]">
              Create an account to start growing plants
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-night-sky">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="John"
                            className={inputStyles}
                            aria-invalid={!!fieldState.error}
                            {...field}
                          />
                          {renderStatusIcon('firstName')}
                        </div>
                      </FormControl>
                      <FormMessage className="text-[#EB5757]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-night-sky">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Doe"
                            className={inputStyles}
                            aria-invalid={!!fieldState.error}
                            {...field}
                          />
                          {renderStatusIcon('lastName')}
                        </div>
                      </FormControl>
                      <FormMessage className="text-[#EB5757]" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex items-center justify-between gap-2">
                        <FormLabel className="text-sm text-night-sky">
                          Phone Number
                        </FormLabel>
                        <span className="text-xs text-grey-x-dark">
                          (optional)
                        </span>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="+380XXXXXXXXX"
                            className={inputStyles}
                            aria-invalid={!!fieldState.error}
                            {...field}
                          />
                          {renderStatusIcon('phoneNumber')}
                        </div>
                      </FormControl>
                      <FormMessage className="text-[#EB5757]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-night-sky">
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="nick.name@mail.com"
                            className={inputStyles}
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
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-night-sky">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className={inputStyles}
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-night-sky">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className={inputStyles}
                            aria-invalid={!!fieldState.error}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2F9E44]"
                          >
                            {showConfirmPassword ? (
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
              </div>

              {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-[#EB5757]">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="gradient"
                className="w-full text-base  text-white rounded-2xl md:w-auto"
                disabled={loading || !form.formState.isValid}
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-grey-x-dark">
            Already have an account?{' '}
            <Link href={ROUTES.LOGIN} className="font-semibold text-[#2F9E44]">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;