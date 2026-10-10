import { access, readFile } from "node:fs/promises";
import { join } from "node:path";

const files = ["messages/uz.json", "messages/ru.json", "messages/en.json"];

const requiredKeys = [
  "nav.discover", "search.destination", "search.reset", "hotel.book", "booking.confirmed",
  "chat.title", "account.title", "category.Luxury", "amenities.Breakfast",
];
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

const source = await readFile("src/lib/hotels.ts", "utf8");
const catalogSource = source.split("const names = [")[1]?.split("] as const;")[0];
if (!catalogSource) throw new Error("Could not locate the seeded hotel catalog.");
const records = [...catalogSource.matchAll(/^\s*\["([^"]+)",\s*"([^"]+)"/gm)];
const slugs = records.map((record) => record[1]);
if (slugs.length < 50 || new Set(slugs).size !== slugs.length) {
  throw new Error(`Catalog requires at least 50 unique slugs; found ${slugs.length}.`);
}
const photoPaths = [...source.matchAll(/"\/stays\/([a-z0-9-]+\.jpg)"/g)].map((match) => match[1]);
const hero = (await readFile("src/app/page.tsx", "utf8")).match(/url\("\/stays\/([a-z0-9-]+\.jpg)"\)/)?.[1];
for (const photo of new Set([...photoPaths, ...(hero ? [hero] : [])])) {
  await access(join("public", "stays", photo));
}
console.log(`Validated ${files.length} locale JSON files (${keys.length} matching keys), ${slugs.length} unique seeded hotels, and ${new Set(photoPaths).size + (hero ? 1 : 0)} bundled photo references.`);
