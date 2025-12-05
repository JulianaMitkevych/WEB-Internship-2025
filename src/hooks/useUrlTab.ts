import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type UseUrlTabOptions<T extends string> = {
  paramName?: string;
  validValues: readonly T[];
  defaultValue: T;
};

export function useUrlTab<T extends string>({
  paramName = 'tab',
  validValues,
  defaultValue,
}: UseUrlTabOptions<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInternalChangeRef = useRef(false);

  // Get initial tab from URL or use default
  const initialTab = useMemo(() => {
    const tabFromUrl = searchParams.get(paramName);
    if (tabFromUrl && validValues.includes(tabFromUrl as T)) {
      return tabFromUrl as T;
    }
    return defaultValue;
  }, [searchParams, paramName, validValues, defaultValue]);

  const [activeTab, setActiveTab] = useState<T>(initialTab);

  // Update state when URL changes (only if change was external, e.g., browser back/forward)
  useEffect(() => {
    // Skip update if the change was initiated by us
    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      return;
    }

    if (activeTab !== initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, activeTab]);

  const handleTabChange = (value: string) => {
    const newTab = value as T;

    // Validate the tab value
    if (!validValues.includes(newTab)) {
      console.warn(
        `Invalid tab value: ${newTab}. Valid values are:`,
        validValues
      );
      return;
    }

    // Mark as internal change to prevent useEffect from overriding
    isInternalChangeRef.current = true;

    // Update state immediately
    setActiveTab(newTab);

    // Update URL immediately using browser API for instant update
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramName, newTab);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      '',
      newUrl
    );

    // Sync with Next.js router (async, but URL is already updated)
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return {
    activeTab,
    handleTabChange,
  };
}
