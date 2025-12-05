import React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Input } from './input';

type TPasswordInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
  placeholder?: string;
};

export function PasswordInput<T extends FieldValues>({
  control,
  name,
  label,
  showPassword,
  onToggleVisibility,
  placeholder,
}: TPasswordInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="relative">
            <FormControl>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                {...field}
                aria-invalid={!!fieldState.error}
                className="pr-10"
              />
            </FormControl>

            <button
              type="button"
              onClick={onToggleVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-xxx-dark hover:text-grey-xxx-dark/80"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
