'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function useRouterPush(appendSearchParams = true) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const push = (path?: string) => {
    const targetPath = path ?? pathname;
    const fullPath = appendSearchParams
      ? `${targetPath}?${searchParams.toString()}`
      : targetPath;

    router.push(fullPath);
  };

  return push;
}
