'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState, Suspense } from 'react';
import { useQueryParams, QueryParamsState } from '@/hooks/useQueryParams';

interface QueryParamContextType {
  queryParams: QueryParamsState;
  updateQueryParams: (
    newParams: QueryParamsState | ((prev: QueryParamsState) => QueryParamsState),
    options?: { replace?: boolean; preserveOthers?: boolean }
  ) => void;
  getQueryParam: (key: string) => string | string[] | undefined;
  removeQueryParams: (keys: string[]) => void;
  clearQueryParams: () => void;
}

const QueryParamContext = createContext<QueryParamContextType | undefined>(undefined);

function QueryParamProviderInner({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const queryParamMethods = useQueryParams();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Provide fallback methods during SSR
  const fallbackMethods: QueryParamContextType = {
    queryParams: {},
    updateQueryParams: () => {},
    getQueryParam: () => undefined,
    removeQueryParams: () => {},
    clearQueryParams: () => {},
  };

  const contextValue = isMounted ? queryParamMethods : fallbackMethods;

  return (
    <QueryParamContext.Provider value={contextValue}>
      {children}
    </QueryParamContext.Provider>
  );
}

export function QueryParamProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={
      <QueryParamContext.Provider value={{
        queryParams: {},
        updateQueryParams: () => {},
        getQueryParam: () => undefined,
        removeQueryParams: () => {},
        clearQueryParams: () => {},
      }}>
        {children}
      </QueryParamContext.Provider>
    }>
      <QueryParamProviderInner>{children}</QueryParamProviderInner>
    </Suspense>
  );
}

export function useQueryParamContext() {
  const context = useContext(QueryParamContext);
  if (context === undefined) {
    throw new Error('useQueryParamContext must be used within a QueryParamProvider');
  }
  return context;
}

export function useQueryParam(key: string) {
  const { getQueryParam } = useQueryParamContext();
  return getQueryParam(key);
}

export function useUpdateQueryParams() {
  const { updateQueryParams } = useQueryParamContext();
  return updateQueryParams;
} 