import { getLLMText } from '@/lib/get-llm-txt';
import { source } from '@/lib/source';

export const revalidate = false;

export async function GET() {
    const scan = source.getPages().map(getLLMText);
    const scanned = await Promise.all(scan);

    return new Response(scanned.join('\n\n'), {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            // Keep dynamic to always reflect docs updates; caching may be handled by the platform/CDN
            'Cache-Control': 'no-store',
        },
    });
}