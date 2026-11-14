import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const host = "www.omnexagoc.com";
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const keyFileName = "a4ba9f2ecbfc825257797f3674b0922e.txt";
const key = readFileSync(path.join(repoRoot, "public", keyFileName), "utf8").trim();
const before = process.env.INDEXNOW_BEFORE;
const after = process.env.INDEXNOW_AFTER;

function changedPaths() {
  if (before && after && /^[a-f0-9]{40,64}$/i.test(before) && /^[a-f0-9]{40,64}$/i.test(after)) {
    return execFileSync("git", ["diff", "--name-only", "--diff-filter=ACMR", before, after], {
      cwd: repoRoot,
      encoding: "utf8"
    }).trim().split("\n").filter(Boolean);
  }
  return process.argv.slice(2);
}

const submitted = new Set();
const corePages = [
  "/",
  "/knowledge",
  "/about",
  "/dhiraj-kumar",
  "/india",
  "/media",
  "/videos",
  "/convergence-brief",
  "/consultancy",
  "/services",
  "/work"
];

for (const changedPath of changedPaths()) {
  const normalized = changedPath.replaceAll("\\", "/");
  if (/^(app\/(layout|robots|sitemap)\.tsx?|lib\/(publications|product-data|site-data)\.ts|\.github\/workflows\/indexnow\.yml)$/.test(normalized)) {
    corePages.forEach((page) => submitted.add(page));
    continue;
  }

  const match = normalized.match(/^app(?:\/(.*))?\/page\.tsx$/);
  if (!match) continue;
  const segments = match[1] ? match[1].split("/") : [];
  if (segments.some((segment) => segment.startsWith("[") && segment.endsWith("]"))) continue;
  const route = segments
    .filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")) && segment !== "page")
    .join("/");
  submitted.add(route ? `/${route}` : "/");
}

const urlList = [...submitted].map((route) => `https://${host}${route}`);
if (urlList.length === 0) {
  console.log("No changed public page routes to submit to IndexNow.");
  process.exit(0);
}

if (process.env.INDEXNOW_DRY_RUN === "1") {
  console.log(JSON.stringify({ host, keyLocation: `https://${host}/${keyFileName}`, urlList }, null, 2));
  process.exit(0);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `https://${host}/${keyFileName}`,
    urlList
  })
});

if (!response.ok) {
  const detail = await response.text();
  throw new Error(`IndexNow rejected the submission (${response.status}): ${detail}`);
}

console.log(`IndexNow accepted ${urlList.length} public URL(s) for ${host}.`);
