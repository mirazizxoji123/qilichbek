import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { cp, readFile, rm } from "node:fs/promises";
import { resolve } from "node:path";

const nextBin = resolve("node_modules/next/dist/bin/next");
const result = spawnSync(process.execPath, [nextBin, "build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    QUICKSTAY_STATIC_EXPORT: "1",
    QUICKSTAY_BUILD_DIR: process.env.QUICKSTAY_BUILD_DIR ?? ".next-static",
  },
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

const exportDirectory = resolve(process.env.QUICKSTAY_BUILD_DIR ?? ".next-static");
if (!existsSync(resolve(exportDirectory, "index.html"))) {
  throw new Error(`Static export completed without ${exportDirectory}/index.html.`);
}

await rm(resolve("out"), { recursive: true, force: true });
await cp(exportDirectory, resolve("out"), { recursive: true });
if (!existsSync(resolve("out/index.html"))) {
  throw new Error("Could not stage the static export at out/index.html.");
}
if (!existsSync(resolve("out/404.html"))) {
  throw new Error("Static export completed without out/404.html.");
}
const catalog = await readFile("src/lib/hotels.ts", "utf8");
const hotelList = catalog.split("const names = [")[1]?.split("] as const;")[0];
const slugs = [...(hotelList ?? "").matchAll(/^\s*\["([^"]+)",/gm)].map((match) => match[1]);
for (const slug of slugs) {
  if (!existsSync(resolve("out", "hotels", slug, "index.html"))) {
    throw new Error(`Static hotel detail page is missing: /hotels/${slug}/`);
  }
}
if (!existsSync(resolve("out/_next")) || !existsSync(resolve("out/stays/hero.jpg"))) {
  throw new Error("Static export is missing JavaScript/CSS chunks or bundled hotel images.");
}
console.log(`Static export verified: out/index.html, out/404.html, ${slugs.length} hotel detail pages, assets, and images.`);
