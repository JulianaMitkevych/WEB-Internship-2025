'use client';

import { ChangeEvent, ComponentProps, useMemo, useRef, useState } from 'react';
import { cn } from '@/utils';
import { useClickOutside } from '@/hooks';
import { Input } from './input';
import { Spinner } from './spinner';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

export interface AutocompleteSelectOption {
  value: string;
  label: string;
  searchText?: string; // Additional text to search by
  [key: string]: any; // Allow additional properties
}

export interface AutocompleteSelectProps
  extends Omit<ComponentProps<'input'>, 'value' | 'onChange'> {
  options: AutocompleteSelectOption[];
  value?: AutocompleteSelectOption;
  onChange?: (option: AutocompleteSelectOption | undefined) => void;
  placeholder?: string;
  emptyText?: string;
  filterOptions?: (
    options: AutocompleteSelectOption[],
    query: string
  ) => AutocompleteSelectOption[];
  isLoading?: boolean;
}

export function AutocompleteSelect({
  options,
  value,
  onChange,
  placeholder = 'Search...',
  emptyText = 'No options found',
  filterOptions,
  isLoading = false,
  ...props
}: AutocompleteSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultFilterOptions = (
    options: AutocompleteSelectOption[],
    query: string
  ) => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) => {
      const searchText = option.searchText || option.label;
      return (
        searchText.toLowerCase().includes(q) ||
        option.value.toLowerCase().includes(q)
      );
    });
  };

  const filtered = useMemo(() => {
    const filterFn = filterOptions || defaultFilterOptions;
    return filterFn(options, query);
  }, [options, query, filterOptions]);

  const handleSelect = (option: AutocompleteSelectOption) => {
    onChange?.(option);
    setQuery('');
    setIsOpen(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    // Show current value as initial query when focusing
    if (value && !query) {
      setQuery(value.label);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    // Show current value as initial query when opening
    if (!isOpen && value && !query) {
      setQuery(value.label);
    }
  };

  useClickOutside(containerRef, () => {
    setIsOpen(false);
    setQuery('');
  });

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <Input
          className="pl-10 pr-10"
          placeholder={placeholder}
          value={isOpen ? query : value?.label || ''}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          autoComplete="off"
          {...props}
        />
        {isLoading ? (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            <Spinner size={20} className="animate-spin" />
          </div>
        ) : (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-night-sky z-10 transition-colors duration-150"
            onClick={toggleDropdown}
          >
            <ChevronDown
              className={cn(
                'min-h-5 min-w-5 transition-transform duration-200 text-night-sky',
                isOpen && 'rotate-180'
              )}
            />
          </button>
        )}
      </div>

      <div
        className={cn(
          'absolute z-50 w-full mt-1 bg-bone-dark border border-sand rounded-sm shadow-lg max-h-60 overflow-y-auto transition-all duration-200 ease-in-out',
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        )}
      >
        {filtered.length > 0 ? (
          filtered.map((option) => {
            const isSelected = value?.value === option.value;
            return (
              <div
                key={option.value}
                className={cn(
                  'px-4 py-3 hover:bg-sand cursor-pointer flex items-center gap-3 transition-colors duration-150',
                  isSelected && 'bg-rock/50'
                )}
                onClick={() => handleSelect(option)}
              >
                <div className="flex-1 text-night-sky">
                  <div className="font-medium">{option.label}</div>
                </div>
                {isSelected && (
                  <div className="text-night-sky">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="px-4 py-3 text-grey-x-dark text-center">
            {emptyText}
          </div>
        )}
      </div>
    </div>
  );
}
