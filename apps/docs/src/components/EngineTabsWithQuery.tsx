'use client';

import { useEffect, useRef, useState } from 'react';
import { Tabs } from 'fumadocs-ui/components/tabs';
import { useQueryParamContext } from '@/contexts/QueryParamContext';

interface EngineTabsWithQueryProps {
  items: string[];
  children: string;
  defaultTab?: string;
}

export function EngineTabsWithQuery({ 
  items, 
  children, 
  defaultTab 
}: EngineTabsWithQueryProps) {
  const { queryParams, updateQueryParams } = useQueryParamContext();
  const tabsRef = useRef<HTMLDivElement>(null);
  const [tabsKey, setTabsKey] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Determine default index based on query parameter
  const getCurrentIndex = () => {
    if (!isMounted) {
      // During SSR, use default tab or first item
      if (defaultTab && items.includes(defaultTab)) {
        return items.indexOf(defaultTab);
      }
      return 0;
    }

    const gameEngine = queryParams.gameengine as string;
    if (gameEngine && items.includes(gameEngine)) {
      return items.indexOf(gameEngine);
    }
    if (defaultTab && items.includes(defaultTab)) {
      return items.indexOf(defaultTab);
    }
    return 0;
  };

  const currentIndex = getCurrentIndex();

  // Force re-render when gameengine query param changes (only after mount)
  useEffect(() => {
    if (isMounted) {
      setTabsKey(prev => prev + 1);
    }
  }, [queryParams.gameengine, isMounted]);

  // Monitor for tab changes and update query params (only after mount)
  useEffect(() => {
    if (!isMounted) return;
    
    const tabsElement = tabsRef.current;
    if (!tabsElement) return;

    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;
      
      // Look for tab button or tab content
      const tabButton = target.closest('button[data-value], [role="tab"]');
      if (tabButton) {
        // Try to get the value from data attribute or text content
        const value = tabButton.getAttribute('data-value') || 
                      tabButton.textContent?.trim();
        
        if (value && items.includes(value)) {
          updateQueryParams({
            gameengine: value
          }, { replace: true });
        }
      }
    };

    tabsElement.addEventListener('click', handleClick);
    
    return () => {
      tabsElement.removeEventListener('click', handleClick);
    };
  }, [items, updateQueryParams, isMounted]);

  return (
    <div ref={tabsRef}>
      <Tabs 
        key={tabsKey}
        items={items}
        defaultIndex={currentIndex}
      >
        {children}
      </Tabs>
    </div>
  );
} 