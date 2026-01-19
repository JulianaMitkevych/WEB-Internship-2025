
'use client';
import { cn } from '@/utils/helpers';
import type { CropButtonProps } from '@/types/types';

interface ExtendedCropButtonProps extends CropButtonProps {
  isActive?: boolean;
}

export default function CropButton({
  label,
  onClick,
  className,
  isActive,
}: ExtendedCropButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full  min-w-[290px] pt-[6px] pb-[5px] text-xl transition-all duration-300 text-center outline-none',
        isActive
          ? 'text-[#2F7302] font-bold bg-[#D5E3CC] rounded-full scale-105'
          : 'text-[#97B980] font-medium bg-transparent hover:text-[#2F7302]',
        className
      )}
    >
      {label}
    </button>
  );
}
