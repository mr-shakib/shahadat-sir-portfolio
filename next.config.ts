import type { NextConfig } from "next";

// Runs as a Node server: pages read their content from Postgres, edited at /admin.
const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: {
    // Uploads stored in the database go through server actions (Vercel caps these at 4.5 MB;
    // with a Blob store connected, uploads go straight to Blob instead).
    serverActions: { bodySizeLimit: "12mb" },
  },
};

export default nextConfig;
