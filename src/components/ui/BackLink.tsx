'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import React, { useMemo } from 'react';
import { useStorage } from '@/hooks/useStorage';

type TBackLinkProps = {
  baseRoute: string;
  title: string;
};

export function BackLink({ baseRoute, title }: TBackLinkProps) {
  const [{ lastListUrlParams }] = useStorage();

  const href = useMemo(() => {
    const params = lastListUrlParams?.[baseRoute] || '';
    return `${baseRoute}${params ? `?${params}` : ''}`;
  }, [baseRoute, lastListUrlParams]);

  return (
    <Link
      prefetch={false}
      href={href}
      className="inline-flex items-center gap-[10px] font-medium text-2xl text-dark-100 hover:text-gray-800 transition-colors"
    >
      <ChevronLeft className="h-8 w-8" />
      {title}
    </Link>
  );
}
