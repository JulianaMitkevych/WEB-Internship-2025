'use client';

import { useMemo } from 'react';
import {
  AutocompleteSelect,
  type AutocompleteSelectOption,
} from '@/components/ui/autocomplete-select';
import { TCountry } from '@/types/types';

type TCountryAutocompleteProps = {
  countries: TCountry[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  isLoading?: boolean;
};

export function CountryAutocomplete({
  countries,
  value,
  onChange,
  placeholder = 'Search or select country',
  emptyText = 'No countries found',
  disabled = false,
  isLoading = false,
  ...props
}: TCountryAutocompleteProps) {
  const countryOptions: AutocompleteSelectOption[] = useMemo(() => {
    return countries.map((country: TCountry) => ({
      value: country.countryId,
      label: country.countryName,
      searchText: `${country.countryName} +${country.countryCode} ${country.countryId}`,
      dialCode: country.countryCode,
    }));
  }, [countries]);

  const selectedOption = countryOptions.find(
    (option) => option.value === value
  );

  const handleChange = (option: AutocompleteSelectOption | undefined) => {
    onChange(option?.value || '');
  };

  return (
    <AutocompleteSelect
      {...props}
      options={countryOptions}
      value={selectedOption}
      onChange={handleChange}
      placeholder={placeholder}
      emptyText={emptyText}
      disabled={disabled}
      isLoading={isLoading}
    />
  );
}
