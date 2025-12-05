'use client';

import { useMemo } from 'react';
import { Control } from 'react-hook-form';
import { PasswordInput } from './password-input';
import { ValidationBadge } from './validation-badge';
import { useTranslation } from '@/lib/i18n';

type TPasswordFieldWithValidationProps = {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
  passwordValue: string;
};

export function PasswordFieldWithValidation({
  control,
  name,
  label,
  placeholder,
  showPassword,
  onToggleVisibility,
  passwordValue,
}: TPasswordFieldWithValidationProps) {
  const { t } = useTranslation();

  const rulesState = useMemo(
    () => ({
      min8: passwordValue.length >= 8,
      uppercase: /[A-Z]/.test(passwordValue),
      lowercase: /[a-z]/.test(passwordValue),
      number: /\d/.test(passwordValue),
    }),
    [passwordValue]
  );

  return (
    <div>
      <PasswordInput
        control={control}
        name={name}
        label={label}
        showPassword={showPassword}
        onToggleVisibility={onToggleVisibility}
        placeholder={placeholder}
      />
      <div className="flex flex-wrap gap-2 mt-2">
        <ValidationBadge
          isValid={rulesState.min8}
          text={t('auth.passwordBadges.min8')}
        />
        <ValidationBadge
          isValid={rulesState.uppercase}
          text={t('auth.passwordBadges.uppercase')}
        />
        <ValidationBadge
          isValid={rulesState.lowercase}
          text={t('auth.passwordBadges.lowercase')}
        />
        <ValidationBadge
          isValid={rulesState.number}
          text={t('auth.passwordBadges.number')}
        />
      </div>
    </div>
  );
}
