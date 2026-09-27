import type { NextConfig } from "next";

// EXPORT_BUILD=1 → static export for GitHub Pages (repo served under /UGC-NET-GATE-Schedule).
// Default (no env) → standalone Node server for Railway/Docker/VPS with SQLite API routes.
const isExport = process.env.EXPORT_BUILD === "1";
const repo = "UGC-NET-GATE-Schedule";

const shared: Partial<NextConfig> = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

const nextConfig: NextConfig = isExport
  ? {
      ...shared,
      output: "export",
      distDir: ".next-export",
      basePath: `/${repo}`,
      assetPrefix: `/${repo}/`,
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {
      ...shared,
      output: "standalone",
    };

export default nextConfig;
