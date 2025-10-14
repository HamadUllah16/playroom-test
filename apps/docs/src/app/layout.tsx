import '@/app/global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { QueryParamProvider } from '@/contexts/QueryParamContext';
import { QueryParamSync } from '@/components/QueryParamSync';
import { Suspense } from 'react';

import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body suppressHydrationWarning className="flex flex-col min-h-screen">
        <RootProvider>
        <QueryParamProvider>
          <Suspense fallback={null}>
            <QueryParamSync />
          </Suspense>

          {children}
          </QueryParamProvider>
        </RootProvider>
      </body>
    </html>
  );
}
