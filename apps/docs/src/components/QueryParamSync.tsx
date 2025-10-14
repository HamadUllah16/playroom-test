'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const STORAGE_KEY = 'docs_query_params';

export function QueryParamSync() {
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only run effects after component is mounted on client
  useEffect(() => {
    if (!isMounted) return;

    try {
      const storedParams = localStorage.getItem(STORAGE_KEY);
      if (storedParams) {
        const parsedParams = JSON.parse(storedParams);
        const currentParams = new URLSearchParams(searchParams);
        let hasChanges = false;

        // Check if any stored params are missing from current URL
        Object.entries(parsedParams).forEach(([key, value]) => {
          if (value && !currentParams.has(key)) {
            currentParams.set(key, String(value));
            hasChanges = true;
          }
        });

        // Update URL if we added any missing params
        if (hasChanges) {
          const newUrl = `${pathname}?${currentParams.toString()}`;
          router.replace(newUrl);
        }
      }
    } catch (error) {
      console.warn('Failed to restore query params from localStorage:', error);
    }
  }, [searchParams, router, pathname, isMounted]);

  // Save current query params to localStorage
  useEffect(() => {
    if (!isMounted) return;

    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
    } catch (error) {
      console.warn('Failed to save query params to localStorage:', error);
    }
  }, [searchParams, isMounted]);

  // Save query params before page unload
  useEffect(() => {
    if (!isMounted) return;

    const handleBeforeUnload = () => {
      const params: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        params[key] = value;
      });

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
      } catch (error) {
        console.warn('Failed to save query params on unload:', error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [searchParams, isMounted]);

  return null;
} 