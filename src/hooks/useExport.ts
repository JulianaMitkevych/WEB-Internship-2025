'use client';

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from './useApi';
import { useStorage } from './useStorage';

type ExportParams = {
  endpoint: string;
  total: number;
  filenamePrefix: string;
  errorMessageKey: string;
};

export function useExport() {
  const { download } = useApi();
  const [, setStore] = useStorage();
  const { t } = useTranslation();

  const exportCsv = useCallback(
    async ({
      endpoint,
      total,
      filenamePrefix,
      errorMessageKey,
    }: ExportParams) => {
      try {
        const blob = await download(`${endpoint}?pageSize=${total}`);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const timestamp = new Date().toISOString().replace(/[:\.]/g, '-');
        a.download = `${filenamePrefix}_export_${timestamp}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (e) {
        console.error(e);
        setStore((prev) => ({
          ...prev,
          error: t(errorMessageKey),
        }));
      }
    },
    [download, setStore, t]
  );

  return exportCsv;
}
