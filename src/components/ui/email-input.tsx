import React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useTranslation } from '@/lib/i18n';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type TEmailInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  placeholder?: string;
};

export function EmailInput<T extends FieldValues>({
  control,
  name,
  placeholder,
}: TEmailInputProps<T>) {
  const { t } = useTranslation();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('auth.email')}</FormLabel>
          <FormControl>
            <Input
              type="email"
              placeholder={placeholder || t('auth.emailPlaceholder')}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
