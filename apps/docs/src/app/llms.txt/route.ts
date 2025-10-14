import { stripFrontmatter } from "@/lib/get-llm-txt";
import { source } from "@/lib/source";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const url = request.nextUrl;
    const pathname = url.pathname;
    // If the rewrite provided a slug as a query parameter, prefer that
    const slugParam = url.searchParams.get('slug')?.trim() ?? '';
    let normalized = '';
    if (slugParam) {
        normalized = slugParam.replace(/^\/+|\/+$/g, '');
    } else {
        // Normalize path to remove optional basePath (e.g. "/docs") and the trailing llms.txt
        normalized = pathname
            // strip basePath if present
            .replace(/^\/docs(\/|$)/, "/")
            // ensure we remove the trailing llms.txt whether or not it has a leading slash
            .replace(/\/?llms\.txt$/, "")
            // remove any leading slashes
            .replace(/^\/+/, "");
    }

    if (normalized) {
        const page = source.getPage(normalized.split('/'));
        if (!page) {
            return new Response('Page not found', { status: 404 });
        }
        const raw = await (page.data.content);
        const processed = stripFrontmatter(raw);
        return new Response(processed, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
    }

    const pages = source.getPages();
    const tocLines: string[] = [];
    tocLines.push('# Documentation Table of Contents');
    for (const p of pages) {
        const title = p.data.title ?? '(Untitled)';
        const description = p.data.description ?? '';
        const link = `/docs${p.url}`;
        tocLines.push(`- [${title}](${link})`);
        if (description) tocLines.push(`  - ${description}`);
    }

    return new Response(tocLines.join('\n'), {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}


