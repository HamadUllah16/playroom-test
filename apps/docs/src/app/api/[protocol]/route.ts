// app/api/[transport]/route.ts
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { source } from "@/lib/source";
import { getLLMText, stripFrontmatter } from "@/lib/get-llm-txt";
const handler = createMcpHandler(
    (server) => {
        // Return a markdown Table of Contents for the docs (equivalent to /docs/llms.txt without page param)
        server.tool(
            "docs_toc",
            "Returns a markdown table of contents for the documentation",
            {},
            async () => {
                const pages = source.getPages();
                const tocLines: string[] = [];
                tocLines.push("# Documentation Table of Contents");
                for (const p of pages) {
                    const title = p.data.title ?? "(Untitled)";
                    const description = p.data.description ?? "";
                    const link = `/docs${p.url}`;
                    tocLines.push(`- [${title}](${link})`);
                    if (description) tocLines.push(`  - ${description}`);
                }

                return {
                    content: [{ type: "text", text: tocLines.join("\n") }],
                };
            }
        )
		// Return a single page's documentation text by slug (equivalent to /docs/quick-start/setting-up-playroomkit/llms.txt)
		server.tool(
			"docs_page",
			"Returns a single page's documentation (slug like 'quick-start/setting-up-playroomkit')",
			{
				page: z.string().min(1),
			},
			async ({ page }) => {
				const slugs = page.split("/");
				const found = source.getPage(slugs);
				if (!found) {
					return {
						content: [
							{ type: "text", text: "Page not found" },
						],
						isError: true,
					};
				}
				const raw = await found.data.content;
				const processed = stripFrontmatter(raw);
				return {
					content: [{ type: "text", text: processed }],
				};
			}
		);
        // Return full documentation text (equivalent to /docs/llms-full.txt)
        server.tool(
            "docs_full",
            "Returns the entire documentation corpus as plain text",
            {},
            async () => {
                const scan = source.getPages().map(getLLMText);
                const scanned = await Promise.all(scan);
                return {
                    content: [
                        { type: "text", text: scanned.join("\n\n") },
                    ],
                };
            }
        );
    },
    {
        // Optional server options

    },
    {
        // Optional redis config
        basePath: "/api", // this needs to match where the [transport] is located.
        maxDuration: 60,
		verboseLogs: true,
        disableSse: true
    }
);
export { handler as GET, handler as POST };