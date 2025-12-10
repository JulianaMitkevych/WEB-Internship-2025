import { z } from 'zod';
import {EMAIL_REGEX} from '../utils/regex'

export const SignUpSchema = z
  .object({
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
