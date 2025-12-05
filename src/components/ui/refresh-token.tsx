'use client';

import { useApi } from '@/hooks';
import React, { useEffect, useCallback } from 'react';
import { ROUTES } from '@/utils';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export const RefreshToken = () => {
  const { post } = useApi();
  const router = useRouter();

  const handleRefresh = useCallback(async () => {
    try {
      await post(ROUTES.API.AUTH.REFRESH);
    } catch (error) {
      console.error(error);
    } finally {
      router.refresh();
    }
  }, [post, router]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  return <LoadingSpinner overlay variant="ring" size={80} />;
};
