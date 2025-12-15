

import { z } from 'zod';

import { LogInSchema, SignUpSchema } from '@/lib/zod-schemas';

export type SignUpFormValues = z.infer<typeof SignUpSchema>;
export type LogInFormValues = z.infer<typeof LogInSchema>;

export type UserProfile = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  createdAt: string | null;
};
