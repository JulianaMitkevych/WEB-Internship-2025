'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useTranslation } from 'react-i18next';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  onValueChange?: (value: string | number) => void;
  placeholder?: string;
  size?: 'sm' | 'md';
  className?: string;
  inputClassName?: string;
  dropdownClassName?: string;
  disabled?: boolean;
  hideArrow?: boolean;
}

export function Select({
  options,
  value,
  onValueChange,
  placeholder = 'Select option',
  className,
  inputClassName,
  dropdownClassName,
  disabled = false,
  hideArrow = false,
}: SelectProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<
    SelectOption | undefined
  >(options.find((opt) => opt.value === value));

  const selectRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [renderAbove, setRenderAbove] = React.useState(false);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    const option = options.find((opt) => opt.value === value);
    setSelectedOption(option);
  }, [value, options]);

  // Decide whether to render the dropdown above or below depending on viewport space
  React.useEffect(() => {
    if (!isOpen) return;

    const computePlacement = () => {
      const MAX_DROPDOWN_HEIGHT = 320; // equals max-h-80
      const root = selectRef.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // Prefer below; flip to above only if below space is insufficient and above has more room
      if (spaceBelow < MAX_DROPDOWN_HEIGHT && spaceAbove > spaceBelow) {
        setRenderAbove(true);
      } else {
        setRenderAbove(false);
      }
    };

    computePlacement();
    window.addEventListener('resize', computePlacement);
    window.addEventListener('scroll', computePlacement, true);
    return () => {
      window.removeEventListener('resize', computePlacement);
      window.removeEventListener('scroll', computePlacement, true);
    };
  }, [isOpen]);

  // Gradient styles identical to Input
  const styleWhenNotFocused: React.CSSProperties = {
    backgroundImage:
      'linear-gradient(94.99deg, #FCF9F2 -15.53%, #FFFDF6 132.51%), linear-gradient(181.78deg, #EEE5D2 0.25%, rgba(250, 247, 240, 0) 48.39%, rgba(235, 227, 208, 0.29) 98.49%)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    border: '1px solid transparent',
    boxShadow:
      '1px 1px 5px 0px #F2E8D3CC inset, -4px -4px 5px 0px #FFFEFC inset',
  };
  const styleWhenFocused: React.CSSProperties = {
    background: 'transparent',
    border: '1px solid',
    borderColor: 'var(--color-input-border)',
    boxShadow: 'none',
  };
  const computedStyle: React.CSSProperties = isFocused
    ? styleWhenFocused
    : styleWhenNotFocused;

  const handleSelect = (option: SelectOption) => {
    setSelectedOption(option);
    onValueChange?.(option.value);
    setIsOpen(false);
  };

  const toggleOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // Function to translate label
  const translateLabel = (label: string) => {
    // If label is a translation key (contains dot), translate it
    if (label.includes('.')) {
      return t(label);
    }
    // Otherwise return as is (for backward compatibility)
    return label;
  };

  return (
    <div ref={selectRef} className={cn('relative', className)}>
      <button
        aria-expanded={isOpen}
        className={cn(
          'inline-flex items-center whitespace-nowrap w-full justify-between gap-5 py-1 px-3 h-11 rounded-sm border bg-transparent text-night-sky font-normal focus-visible:border-input-border',
          disabled && 'opacity-50 cursor-not-allowed',
          inputClassName
        )}
        onClick={toggleOpen}
        disabled={disabled}
        style={computedStyle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <span
          className={cn(
            'truncate text-dark-100',
            !selectedOption && 'text-gray-500'
          )}
        >
          {selectedOption ? translateLabel(selectedOption.label) : placeholder}
        </span>
        {!hideArrow && (
          <ChevronDown
            className={cn(
              'min-h-5 min-w-5 transition-transform duration-200 text-night-sky',
              isOpen && 'rotate-180'
            )}
          />
        )}
      </button>

      {/* Dropdown */}
      <div
        ref={dropdownRef}
        className={cn(
          'absolute rounded-sm left-0 right-0 z-50 bg-bone-dark border border-sand shadow-lg overflow-hidden',
          renderAbove ? 'bottom-full mb-1' : 'top-full mt-1',
          'transition-all duration-200 ease-in-out',
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : renderAbove
              ? 'opacity-0 scale-95 translate-y-2 pointer-events-none'
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none',
          dropdownClassName
        )}
      >
        <div className="max-h-80 overflow-y-auto flex flex-col">
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                'cursor-pointer transition-colors duration-150',
                'flex items-center px-4 py-3 flex-shrink-0',
                option.value === selectedOption?.value
                  ? 'bg-rock/50 text-night-sky'
                  : 'hover:bg-sand text-night-sky'
              )}
              onClick={() => handleSelect(option)}
            >
              <span className="truncate flex-1">
                {translateLabel(option.label)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
