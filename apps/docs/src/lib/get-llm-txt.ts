import { source } from '@/lib/source';
import type { InferPageType } from 'fumadocs-core/source';

export async function getLLMText(page: InferPageType<typeof source>) {
    const raw = await (page.data.content);
    const processed = stripFrontmatter(raw);

    return `(${page.url})

${processed}`;
}
export function stripFrontmatter(content: string): string {
    if (!content) return content;
    // Remove a leading YAML frontmatter block delimited by --- ... --- at the top of the file
    // Uses non-greedy match to stop at the first closing delimiter
    return content.replace(/^---[\s\S]*?\n---\s*\n?/, '');
}
