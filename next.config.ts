import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.QUICKSTAY_STATIC_EXPORT === "1" ? { output: "export" as const, trailingSlash: true } : {}),
  ...(process.env.QUICKSTAY_BUILD_DIR ? { distDir: process.env.QUICKSTAY_BUILD_DIR } : {}),
  images: { unoptimized: true },
};

export default nextConfig;
