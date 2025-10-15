import fs from "fs";
import path from "path";
import { stripFrontmatter } from "@/lib/get-llm-txt";
import { source } from "@/lib/source";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const url = request.nextUrl;
    const pathname = url.pathname;
    const slugParam = url.searchParams.get("slug")?.trim() ?? "";

    // Normalize slug
    let normalized = "";
    if (slugParam) {
        normalized = slugParam.replace(/^\/+|\/+$/g, "");
    } else {
        normalized = pathname
            .replace(/^\/docs(\/|$)/, "/") // remove basePath
            .replace(/\/?llms\.txt$/, "")  // remove llms.txt suffix
            .replace(/^\/+/, "");           // remove leading slashes
    }

    // Serve MDX file from public/content
    if (normalized) {
        const mdxPath = path.join(process.cwd(), "public", "content", ...normalized.split("/")) + ".mdx";
        console.log("[llms.txt] Resolved MDX path:", mdxPath);

        if (!fs.existsSync(mdxPath)) {
            return new Response("Page not found", { status: 404 });
        }

        const raw = fs.readFileSync(mdxPath, "utf-8");
        const processed = stripFrontmatter(raw);

        return new Response(processed, {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
    }

    // If no slug, return Table of Contents
    const pages = source.getPages();
    const tocLines: string[] = ["# Documentation Table of Contents"];

    for (const p of pages) {
        const title = p.data.title ?? "(Untitled)";
        const description = p.data.description ?? "";
        const link = `/docs${p.url}`;
        tocLines.push(`- [${title}](${link})`);
        if (description) tocLines.push(`  - ${description}`);
    }

    return new Response(tocLines.join("\n"), {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
}
