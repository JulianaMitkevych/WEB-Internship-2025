import { z } from 'zod';

import { EMAIL_REGEX, NAME_REGEX, PHONE_REGEX } from '../utils/regex';

export const SignUpSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, 'First name should be at least 2 characters')
      .max(50, 'First name is too long')
      .regex(NAME_REGEX.VALID_NAME, 'First name contains invalid characters'),
    lastName: z
      .string()
      .trim()
      .min(2, 'Last name should be at least 2 characters')
      .max(50, 'Last name is too long')
      .regex(NAME_REGEX.VALID_NAME, 'Last name contains invalid characters'),
    phoneNumber: z
      .string()
      .trim()
      .optional()
      .transform((value) => (value === '' ? undefined : value))
      .refine(
        (value) => !value || PHONE_REGEX.E164_BASIC.test(value),
        'Phone number should be in international format, e.g. +380XXXXXXXXX'
      ),
    email: z
      .string()
      .trim()
      .regex(EMAIL_REGEX.VALID_EMAIL, 'Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpFormValues = z.infer<typeof SignUpSchema>;

export const LogInSchema = z.object({
  email: z
    .string()
    .trim()
    .regex(EMAIL_REGEX.VALID_EMAIL, 'Invalid email address'),
  password: z.string().min(8, 'Password is required'),
});

export type LogInFormValues = z.infer<typeof LogInSchema>;
