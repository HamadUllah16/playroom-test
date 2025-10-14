import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { EngineTabsWithQuery } from '@/components/EngineTabsWithQuery';
import Preview from '@/app/components/preview';

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    EngineTabsWithQuery,
    Preview,
    ...components,
  };
}
