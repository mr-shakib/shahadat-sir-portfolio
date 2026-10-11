import "server-only";
import postgres from "postgres";
import { sourceOptions, specs, type Spec } from "./schema";
import { seed } from "./seed";
import type { ListKey } from "./types";
import { validate } from "./validate";

declare global {
  var __portfolioSql: postgres.Sql | undefined;
  var __portfolioReady: { collections: string; done: Promise<void> } | undefined;
}

/** The shared connection pool, created on first use so builds don't need a database. */
export function db() {
  if (!globalThis.__portfolioSql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.");
    globalThis.__portfolioSql = postgres(url, { max: 5, idle_timeout: 30, onnotice: () => {} });
  }
  return globalThis.__portfolioSql;
}

const schema = `
  create table if not exists entries (
    id uuid primary key default gen_random_uuid(),
    collection text not null,
    position double precision not null default 0,
    data jsonb not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );
  create index if not exists entries_collection_position on entries (collection, position);

  create table if not exists media (
    id uuid primary key default gen_random_uuid(),
    filename text not null,
    content_type text not null,
    size integer not null,
    width integer,
    height integer,
    bytes bytea not null,
    created_at timestamptz not null default now()
  );

  create table if not exists meta (
    key text primary key,
    value text not null
  );
`;

const collections = Object.keys(specs).join(",");

/**
 * Creates the tables and seeds collections that have never been seeded. Runs once per server, and
 * again when the code defines new collections (so a dev server picks them up without a restart).
 */
export function ready() {
  if (globalThis.__portfolioReady?.collections !== collections) {
    const done = setup().catch((error) => {
      globalThis.__portfolioReady = undefined;
      throw error;
    });
    globalThis.__portfolioReady = { collections, done };
  }
  return globalThis.__portfolioReady.done;
}

async function setup() {
  await db().begin(async (tx) => {
    await tx`select pg_advisory_xact_lock(724001)`;
    await tx.unsafe(schema);

    const done = new Set(
      (await tx<{ key: string }[]>`select key from meta where key like 'seeded:%'`).map((r) => r.key),
    );
    const pending = (Object.values(specs) as Spec[]).filter((s) => !done.has(`seeded:${s.key}`));
    if (!pending.length) return;

    const sources = sourceOptions((key: ListKey) => seed[key]);
    for (const spec of pending) {
      const items: unknown[] = spec.kind === "list" ? seed[spec.key] : [seed[spec.key]];
      const rows = items.map((item, position) => {
        const { data, errors, ok } = validate(spec.fields, item, sources);
        if (!ok) throw new Error(`Seed data for "${spec.key}" item ${position} is invalid: ${JSON.stringify(errors)}`);
        return { collection: spec.key, position, data: tx.json(data as postgres.JSONValue) };
      });
      if (rows.length) await tx`insert into entries ${tx(rows, "collection", "position", "data")}`;
      await tx`insert into meta (key, value) values (${`seeded:${spec.key}`}, ${new Date().toISOString()})`;
    }
  });
}
