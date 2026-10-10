import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const nextBin = resolve("node_modules/next/dist/bin/next");
const result = spawnSync(process.execPath, [nextBin, "build"], {
  stdio: "inherit",
  env: { ...process.env, QUICKSTAY_STATIC_EXPORT: "1" },
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

if (!existsSync(resolve("out/index.html"))) {
  throw new Error("Static export completed without out/index.html.");
}

console.log("Static export verified: out/index.html exists.");
