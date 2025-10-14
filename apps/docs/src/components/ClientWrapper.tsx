'use client';

import { Suspense, useEffect, useState } from 'react';
import { QueryParamSync } from './QueryParamSync';

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {isMounted && (
        <Suspense fallback={null}>
          <QueryParamSync />
        </Suspense>
      )}
      {children}
    </>
  );
} 