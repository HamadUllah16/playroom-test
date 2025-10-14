import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <Image
        src="/docs/kitlogo.svg" 
        alt="PlayroomKit" 
        className="w-44 h-7 mt-0 filter invert dark:filter-none"
        width={176}
        height={40}
      />
    ),
   "transparentMode": "always",
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [],
};
