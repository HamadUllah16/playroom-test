import fs from "fs";
import path from "path";

console.log("Current working directory:", process.cwd());

const src = path.join(process.cwd(), "apps", "docs", "content"); // original content folder
const dest = path.join(process.cwd(), "apps", "docs", "public", "content"); // destination in public

// Delete old content folder if it exists
if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
    console.log(`🗑 Deleted existing public/content folder`);
}

// Copy recursively from source to destination
fs.cpSync(src, dest, { recursive: true });
console.log(`✅ Copied content folder to public/content`);
