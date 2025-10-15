import fs from "fs";
import path from "path";

// Adjust paths relative to this script
const src = path.join(process.cwd(), "content");           // docs/apps/docs/content
const dest = path.join(process.cwd(), ".next", "content"); // docs/apps/docs/.next/content

fs.cpSync(src, dest, { recursive: true });
