'use client';

import { useMemo } from 'react';
import {
  AutocompleteSelect,
  type AutocompleteSelectOption,
} from '@/components/ui/autocomplete-select';
import { TRegion } from '@/types/types';

type TRegionAutocompleteProps = {
  regions: TRegion[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  isLoading?: boolean;
};

export function RegionAutocomplete({
  regions,
  value,
  onChange,
  placeholder = 'Search or select region name',
  emptyText = 'No regions found',
  disabled = false,
  isLoading = false,
  ...props
}: TRegionAutocompleteProps) {
  const regionOptions: AutocompleteSelectOption[] = useMemo(() => {
    return regions.map((region: TRegion) => ({
      value: region.region,
      label: region.region,
      searchText: `${region.region} ${region.timeShift}`,
    }));
  }, [regions]);

  const selectedOption = regionOptions.find((option) => option.value === value);

  const handleChange = (option: AutocompleteSelectOption | undefined) => {
    onChange(option?.value || '');
  };

  return (
    <AutocompleteSelect
      {...props}
      options={regionOptions}
      value={selectedOption}
      onChange={handleChange}
      placeholder={placeholder}
      emptyText={emptyText}
      disabled={disabled}
      isLoading={isLoading}
    />
  );
}
