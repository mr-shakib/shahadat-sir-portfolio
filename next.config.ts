import type { NextConfig } from "next";

// Runs as a Node server: pages read their content from Postgres, edited at /admin.
const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: {
    // Photo and CV uploads from the admin go through server actions.
    serverActions: { bodySizeLimit: "12mb" },
  },
};

export default nextConfig;
