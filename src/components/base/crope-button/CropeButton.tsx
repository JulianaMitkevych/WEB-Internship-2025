'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/utils/helpers';
import type { CropButtonProps } from '@/types/types';

export default function CropButton({
  label,
  route,
  className,
}: CropButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full px-6 py-4 rounded-xl bg-green-100 text-green-800 font-semibold text-lg transition-all',
        'hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 active:scale-95',
        className
      )}
    >
      {label}
    </button>
  );
}
