import "server-only";

/** Postgres connection string. Vercel's Neon integration sets DATABASE_URL; others set POSTGRES_URL. */
export const databaseUrl = () => process.env.DATABASE_URL || process.env.POSTGRES_URL;

export type UploadConfig = { storage: "blob" | "database"; maxBytes: number };

/**
 * Where admin uploads go. With a Vercel Blob store connected, files go straight from the browser to
 * Blob, so their size isn't limited by the 4.5 MB cap Vercel puts on function requests. Otherwise
 * they are stored in Postgres through a server action, which on Vercel must stay under that cap.
 */
export function uploadConfig(): UploadConfig {
  if (process.env.BLOB_READ_WRITE_TOKEN) return { storage: "blob", maxBytes: 50 * 1024 * 1024 };
  return { storage: "database", maxBytes: (process.env.VERCEL ? 4 : 10) * 1024 * 1024 };
}
