import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseGoogleDocDrafts } from "../src/lib/content/google-doc-parser";
import { normalizeForSeed } from "../src/lib/content/seed-transform";

async function main() {
  const args = new Map<string, string>();
  for (let i = 2; i < process.argv.length; i += 2) {
    args.set(process.argv[i], process.argv[i + 1]);
  }

  const sourceUrl = process.env.GOOGLE_DOC_DRAFTS_URL ?? args.get("--url");
  const sourcePath = path.resolve(args.get("--path") ?? process.env.GOOGLE_DOC_DRAFTS_PATH ?? "content/source/polarity-articles-drafts.txt");
  const outPath = args.get("--out");

  const raw = sourceUrl ? await fetchText(sourceUrl) : await readFile(sourcePath, "utf8");
  const articles = normalizeForSeed(parseGoogleDocDrafts(raw, { sourceRevision: new Date().toISOString() }));
  const payload = JSON.stringify({ articleCount: articles.length, articles }, null, 2);

  if (outPath) {
    await writeFile(path.resolve(outPath), `${payload}\n`);
  } else {
    console.log(payload);
  }
}

async function fetchText(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not fetch Google Docs export: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
