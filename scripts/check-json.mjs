import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const roots = ["messages"];
const files = [];
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) await collect(fullPath);
    else if (entry.name.endsWith(".json")) files.push(fullPath);
  }
}
for (const root of roots) await collect(root);

const requiredKeys = ["nav.discover", "search.destination", "hotel.book", "booking.confirmed", "chat.title", "account.title"];
const baseline = JSON.parse(await readFile("messages/uz.json", "utf8"));
function flatten(value, prefix = "") {
  return Object.entries(value).flatMap(([key, child]) =>
    child && typeof child === "object" && !Array.isArray(child)
      ? flatten(child, prefix ? `${prefix}.${key}` : key)
      : [prefix ? `${prefix}.${key}` : key],
  );
}
const keys = flatten(baseline);
for (const required of requiredKeys) {
  if (!keys.includes(required)) throw new Error(`Missing required Uzbek translation key: ${required}`);
}
for (const file of files) {
  const translations = JSON.parse(await readFile(file, "utf8"));
  const candidateKeys = flatten(translations);
  const missing = keys.filter((key) => !candidateKeys.includes(key));
  const extra = candidateKeys.filter((key) => !keys.includes(key));
  if (missing.length || extra.length) {
    throw new Error(`${file}: translation key mismatch. Missing: ${missing.join(", ") || "none"}; extra: ${extra.join(", ") || "none"}`);
  }
}
console.log(`Validated ${files.length} translation JSON files with ${keys.length} matching keys.`);
