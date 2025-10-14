'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export interface QueryParamsState {
  [key: string]: string | string[] | undefined;
}

const STORAGE_KEY = 'docs_query_params';

export function useQueryParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [queryParams, setQueryParams] = useState<QueryParamsState>({});
  const pendingUrlUpdate = useRef<{ url: string; replace: boolean } | null>(null);

  // Load initial query params from URL and localStorage
  useEffect(() => {
    try {
      const urlParams: QueryParamsState = {};
      
      // Get params from URL - safely handle potential SSR issues
      if (searchParams) {
        searchParams.forEach((value, key) => {
          if (urlParams[key]) {
            // Handle multiple values for the same key
            if (Array.isArray(urlParams[key])) {
              (urlParams[key] as string[]).push(value);
            } else {
              urlParams[key] = [urlParams[key] as string, value];
            }
          } else {
            urlParams[key] = value;
          }
        });
      }

      // Get params from localStorage (only on client)
      if (typeof window !== 'undefined') {
        try {
          const storedParams = localStorage.getItem(STORAGE_KEY);
          if (storedParams) {
            const parsedParams = JSON.parse(storedParams);
            // Merge URL params with stored params, URL params take precedence
            setQueryParams({ ...parsedParams, ...urlParams });
          } else {
            setQueryParams(urlParams);
          }
        } catch (error) {
          console.warn('Failed to parse stored query params:', error);
          setQueryParams(urlParams);
        }
      } else {
        // On server, just use URL params
        setQueryParams(urlParams);
      }
    } catch (error) {
      console.warn('Failed to load query params:', error);
      setQueryParams({});
    }
  }, [searchParams]);

  // Save to localStorage whenever query params change (client only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(queryParams));
      } catch (error) {
        console.warn('Failed to save query params to localStorage:', error);
      }
    }
  }, [queryParams]);

  // Handle pending URL updates
  useEffect(() => {
    if (pendingUrlUpdate.current && typeof window !== 'undefined') {
      const { url, replace } = pendingUrlUpdate.current;
      pendingUrlUpdate.current = null;
      
      try {
        if (replace) {
          router.replace(url);
        } else {
          router.push(url);
        }
      } catch (error) {
        console.warn('Failed to update URL:', error);
      }
    }
  }, [queryParams, router]);

  // Function to update query params
  const updateQueryParams = useCallback((
    newParams: QueryParamsState | ((prev: QueryParamsState) => QueryParamsState),
    options: { replace?: boolean; preserveOthers?: boolean } = {}
  ) => {
    const { replace = false, preserveOthers = true } = options;
    
    setQueryParams(prev => {
      const updatedParams = typeof newParams === 'function' ? newParams(prev) : newParams;
      const finalParams = preserveOthers ? { ...prev, ...updatedParams } : updatedParams;
      
      // Prepare URL update for the effect
      const urlSearchParams = new URLSearchParams();
      
      Object.entries(finalParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => urlSearchParams.append(key, v));
          } else {
            urlSearchParams.set(key, String(value));
          }
        }
      });
      
      const newUrl = `${pathname}${urlSearchParams.toString() ? `?${urlSearchParams.toString()}` : ''}`;
      pendingUrlUpdate.current = { url: newUrl, replace };
      
      return finalParams;
    });
  }, [pathname]);

  // Function to get a specific query param
  const getQueryParam = useCallback((key: string): string | string[] | undefined => {
    return queryParams[key];
  }, [queryParams]);

  // Function to remove specific query params
  const removeQueryParams = useCallback((keys: string[]) => {
    setQueryParams(prev => {
      const updated = { ...prev };
      keys.forEach(key => {
        delete updated[key];
      });
      
      // Prepare URL update for the effect
      const urlSearchParams = new URLSearchParams();
      Object.entries(updated).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => urlSearchParams.append(key, v));
          } else {
            urlSearchParams.set(key, String(value));
          }
        }
      });
      
      const newUrl = `${pathname}${urlSearchParams.toString() ? `?${urlSearchParams.toString()}` : ''}`;
      pendingUrlUpdate.current = { url: newUrl, replace: true };
      
      return updated;
    });
  }, [pathname]);

  // Function to clear all query params
  const clearQueryParams = useCallback(() => {
    setQueryParams({});
    pendingUrlUpdate.current = { url: pathname, replace: true };
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.warn('Failed to clear stored query params:', error);
      }
    }
  }, [pathname]);

  return {
    queryParams,
    updateQueryParams,
    getQueryParam,
    removeQueryParams,
    clearQueryParams,
  };
} 