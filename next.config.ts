import type { NextConfig } from "next";

// Runs as a Node server: pages read their content from Postgres, edited at /admin.
const nextConfig: NextConfig = {
  // .next/standalone holds the server and only the dependencies it uses; the Docker image ships just that.
  output: "standalone",
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: {
    // Uploads stored in the database go through server actions (Vercel caps these at 4.5 MB;
    // with a Blob store connected, uploads go straight to Blob instead).
    serverActions: { bodySizeLimit: "12mb" },
  },
};

export default nextConfig;
