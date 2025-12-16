'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Check, Eye, EyeOff } from 'lucide-react';
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

const inputStyles =
  'h-12 rounded-xl border-2 border-[#4CAF50]/60 bg-white pr-12 text-night-sky';

const SignUpForm = () => {
  const router = useRouter();
  const { post, error, loading } = useApi();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const emailValue = form.watch('email');
  const showEmailCheck =
    !!emailValue &&
    form.formState.touchedFields.email &&
    !form.formState.errors.email;

  return (
    <div className="min-h-screen bg-white overflow-y-auto md:overflow-y-visible">
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-[0px_14px_50px_rgba(0,0,0,0.08)]">
          <div className="mb-8 text-center">
            <div className="grid place-items-center mb-6">
              <PlantIcon size={50} />
            </div>
            <h1 className="text-3xl font-bold text-night-sky">
              Create an account
            </h1>
            <p className="mt-2 text-base text-grey-x-dark">
              Create an account to start growing plants
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <div className="grid grid-cols-1 gap-4 ">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-night-sky">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          className={inputStyles.replace('pr-12', '')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-night-sky">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          className={inputStyles.replace('pr-12', '')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
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
                        <Input
                          placeholder="+380XXXXXXXXX"
                          className={inputStyles.replace('pr-12', '')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                            className={inputStyles}
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
              </div>

              <div className="grid grid-cols-1 gap-4 ">
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
                            placeholder="••••••••"
                            className={inputStyles}
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
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
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2F9E44]"
                            aria-label={
                              showConfirmPassword
                                ? 'Hide password'
                                : 'Show password'
                            }
                          >
                            {showConfirmPassword ? (
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
              </div>

              {error && (
                <div className="rounded-md border  border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-red-500 ">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="gradient"
                className="w-full text-base rounded-2xl md:w-auto"
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
