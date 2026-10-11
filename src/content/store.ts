import "server-only";
import { connection } from "next/server";
import type postgres from "postgres";
import { cache } from "react";
import { db, ready } from "./db";
import { orderList } from "./derive";
import { referencesTo, sourceOptions, specs, type ListSpec, type Spec } from "./schema";
import { seed } from "./seed";
import type { CollectionKey, Content, ListKey, SingleKey } from "./types";
import type { SourceOptions } from "./validate";

type Row = { id: string; collection: string; position: number; data: Record<string, unknown>; updated_at: Date };
type Data = Record<string, unknown>;

/** A stored item as the admin sees it. */
export type Entry = { id: string; data: Data; updatedAt: string };

const toEntry = (r: Row): Entry => ({ id: r.id, data: r.data, updatedAt: r.updated_at.toISOString() });
export const isId = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

async function rows(collection?: string) {
  await ready();
  const sql = db();
  return sql<Row[]>`
    select id, collection, position, data, updated_at from entries
    ${collection ? sql`where collection = ${collection}` : sql``}
    order by position, created_at`;
}

const byCollection = (all: Row[]) => {
  const map = new Map<string, Row[]>();
  for (const r of all) map.set(r.collection, [...(map.get(r.collection) ?? []), r]);
  return map;
};

// ── Public site ───────────────────────────────────────────────────────

declare global {
  var __portfolioContent: { version: string; content: Content } | undefined;
}

/**
 * Everything the site shows. Each request checks a cheap version stamp (row count and latest edit)
 * and reuses the last loaded content when nothing changed, so edits still show up immediately,
 * from any server instance.
 */
export const getContent = cache(async (): Promise<Content> => {
  await connection();
  await ready();
  const [stamp] = await db()<{ version: string }[]>`
    select count(*) || ':' || coalesce(max(updated_at)::text, '') as version from entries`;
  const cached = globalThis.__portfolioContent;
  // The collection list is part of the key, so a code change in development also reloads.
  const version = `${stamp.version}|${Object.keys(specs).join()}`;
  if (cached?.version === version) return cached.content;
  const content = await loadContent();
  globalThis.__portfolioContent = { version, content };
  return content;
});

async function loadContent(): Promise<Content> {
  const all = await rows();
  const map = byCollection(all);
  const values = (from: ListKey, field: string) => (map.get(from) ?? []).map((r) => String(r.data[field]));

  const content: Record<string, unknown> = {};
  for (const spec of Object.values(specs) as Spec[]) {
    const stored = map.get(spec.key) ?? [];
    content[spec.key] =
      spec.kind === "list"
        ? orderList(
            spec,
            stored.map((r) => ({ ...r.data, id: r.id })),
            spec.parent && values(spec.parent.from, spec.parent.value),
          )
        : (stored[0]?.data ?? seed[spec.key]);
  }
  content.updatedAt = new Date(Math.max(0, ...all.map((r) => r.updated_at.getTime())));
  return content as Content;
}

// ── Admin reads ───────────────────────────────────────────────────────

/** A collection's entries in the order the site shows them. */
export async function listEntries(key: ListKey): Promise<Entry[]> {
  const spec = specs[key] as ListSpec;
  const entries = (await rows(key)).map(toEntry);
  const parent = spec.parent;
  const parents = parent ? (await rows(parent.from)).map((r) => String(r.data[parent.value])) : [];
  return orderList(spec, entries, parents, (e) => e.data);
}

export async function getEntry(key: ListKey, id: string): Promise<Entry | null> {
  if (!isId(id)) return null;
  await ready();
  const [row] = await db()<Row[]>`
    select id, collection, position, data, updated_at from entries where id = ${id} and collection = ${key}`;
  return row ? toEntry(row) : null;
}

export async function getSingle(key: SingleKey): Promise<Entry | null> {
  const [row] = await rows(key);
  return row ? toEntry(row) : null;
}

/** Options for fields that take their values from other collections. */
export async function loadSources(): Promise<SourceOptions> {
  const map = byCollection(await rows());
  return sourceOptions((key) => (map.get(key) ?? []).map((r) => r.data));
}

/** Item counts and last edit per collection, for the dashboard. */
export async function collectionStats() {
  await ready();
  const result = await db()<{ collection: string; count: number; updated: Date }[]>`
    select collection, count(*)::int as count, max(updated_at) as updated from entries group by collection`;
  return Object.fromEntries(result.map((r) => [r.collection, { count: r.count, updated: r.updated }]));
}

/** Another item in the collection with the same values for `fields`, if any. */
export async function findDuplicate(key: ListKey, fields: readonly string[], data: Data, exceptId?: string) {
  const match = Object.fromEntries(fields.map((f) => [f, data[f] ?? null]));
  const [row] = await db()<{ id: string }[]>`
    select id from entries
    where collection = ${key} and data @> ${db().json(match as postgres.JSONValue)}
      and id <> ${exceptId ?? "00000000-0000-0000-0000-000000000000"}
    limit 1`;
  return row?.id ?? null;
}

/** How many items in other collections point at this item, e.g. semesters at a university. */
export async function referencesOf(key: ListKey, data: Data) {
  const found: { collection: ListKey; count: number }[] = [];
  for (const ref of referencesTo(key)) {
    const value = data[ref.value];
    if (typeof value !== "string") continue;
    const sql = db();
    const [{ count }] = await sql<{ count: number }[]>`
      select count(*)::int as count from entries
      where collection = ${ref.collection}
        and ${ref.multiple ? sql`data -> ${ref.field} ? ${value}` : sql`data ->> ${ref.field} = ${value}`}`;
    if (count) found.push({ collection: ref.collection, count });
  }
  return found;
}

// ── Admin writes ──────────────────────────────────────────────────────

export async function createEntry(key: ListKey, data: Data) {
  await ready();
  const spec = specs[key];
  const sql = db();
  const atTop = spec.order !== "manual" || spec.newAt === "top";
  const [row] = await sql<{ id: string }[]>`
    insert into entries (collection, position, data)
    select ${key}, ${atTop ? sql`coalesce(min(position), 0) - 1` : sql`coalesce(max(position), 0) + 1`},
      ${sql.json(data as postgres.JSONValue)}
    from entries where collection = ${key}
    returning id`;
  return row.id;
}

/**
 * Saves an item. `expected` is the updatedAt the editor loaded; if the item changed since,
 * nothing is written and "conflict" is returned. Renaming a referenced value (a university's
 * name, a theme's id) updates the items that point at it.
 */
export async function updateEntry(key: CollectionKey, id: string, data: Data, expected?: string) {
  if (!isId(id)) return "missing" as const;
  await ready();
  return db().begin(async (tx) => {
    const [current] = await tx<Row[]>`
      select id, collection, position, data, updated_at from entries
      where id = ${id} and collection = ${key} for update`;
    if (!current) return "missing" as const;
    if (expected && current.updated_at.toISOString() !== expected) return "conflict" as const;
    await tx`update entries set data = ${tx.json(data as postgres.JSONValue)}, updated_at = now() where id = ${id}`;
    if (specs[key].kind === "list") await renameReferences(tx, key as ListKey, current.data, data);
    return "ok" as const;
  });
}

async function renameReferences(tx: postgres.TransactionSql, key: ListKey, before: Data, after: Data) {
  for (const ref of referencesTo(key)) {
    const from = before[ref.value];
    const to = after[ref.value];
    if (typeof from !== "string" || typeof to !== "string" || from === to) continue;
    const path = `{${ref.field}}`;
    if (ref.multiple) {
      await tx`
        update entries set updated_at = now(), data = jsonb_set(data, ${path}::text[], (
          select coalesce(jsonb_agg(case when v = ${from}::text then ${to}::text else v end), '[]'::jsonb)
          from jsonb_array_elements_text(data -> ${ref.field}) as v))
        where collection = ${ref.collection} and data -> ${ref.field} ? ${from}`;
    } else {
      await tx`
        update entries set updated_at = now(), data = jsonb_set(data, ${path}::text[], to_jsonb(${to}::text))
        where collection = ${ref.collection} and data ->> ${ref.field} = ${from}`;
    }
  }
}

/** Saves a single-record collection such as the profile. */
export async function saveSingle(key: SingleKey, data: Data, expected?: string) {
  const existing = await getSingle(key);
  if (existing) return updateEntry(key, existing.id, data, expected);
  await db()`insert into entries (collection, position, data) values (${key}, 0, ${db().json(data as postgres.JSONValue)})`;
  return "ok" as const;
}

export async function deleteEntry(key: ListKey, id: string) {
  if (!isId(id)) return;
  await ready();
  await db()`delete from entries where id = ${id} and collection = ${key}`;
}

/** Swaps an item with its neighbour above (-1) or below (1), within its group when the collection has a parent. */
export async function moveEntry(key: ListKey, id: string, direction: -1 | 1) {
  if (!isId(id)) return;
  const group = (specs[key] as ListSpec).parent?.field;
  await ready();
  await db().begin(async (tx) => {
    const [current] = await tx<Row[]>`
      select id, position, data from entries where id = ${id} and collection = ${key} for update`;
    if (!current) return;
    const [neighbour] = await tx<Row[]>`
      select id, position from entries
      where collection = ${key}
        and ${group ? tx`data ->> ${group} = ${String(current.data[group] ?? "")}` : tx`true`}
        and ${direction < 0 ? tx`position < ${current.position}` : tx`position > ${current.position}`}
      order by position ${direction < 0 ? tx`desc` : tx`asc`}
      limit 1 for update`;
    if (!neighbour) return;
    // Reordering counts as an edit, so the site's content cache sees it.
    await tx`update entries set position = ${neighbour.position}, updated_at = now() where id = ${current.id}`;
    await tx`update entries set position = ${current.position}, updated_at = now() where id = ${neighbour.id}`;
  });
}

// ── Media ─────────────────────────────────────────────────────────────

export async function saveMedia(file: {
  filename: string;
  contentType: string;
  bytes: Buffer;
  width?: number;
  height?: number;
}) {
  await ready();
  const [row] = await db()<{ id: string }[]>`
    insert into media (filename, content_type, size, width, height, bytes)
    values (${file.filename}, ${file.contentType}, ${file.bytes.length}, ${file.width ?? null}, ${file.height ?? null}, ${file.bytes})
    returning id`;
  return row.id;
}

export async function getMedia(id: string) {
  if (!isId(id)) return null;
  await ready();
  const [row] = await db()<{ filename: string; content_type: string; bytes: Buffer }[]>`
    select filename, content_type, bytes from media where id = ${id}`;
  return row ?? null;
}
