import { source } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getMDXComponents } from '@/mdx-components';
import CopyMarkdown from '@/app/components/copy-markdown';

export const dynamic = 'force-dynamic';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  
  const content = (
    <DocsPage toc={page.data.toc} full={page.data.full}
    
    footer={{
      enabled: page.url === '/' ? false : true,
    }}
    tableOfContent={{
        style: 'clerk',
      }}
      tableOfContentPopover={{
        style: 'clerk'
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className='flex flex-col gap-4'>
        {page.data.description}
        <CopyMarkdown slugs={page.slugs} />
      </DocsDescription>
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );

  // Only wrap with EngineProvider for gameengine pages

  return content;
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
