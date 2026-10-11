"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { LuArrowDown, LuArrowUp, LuPencil, LuSearch, LuTrash2 } from "react-icons/lu";
import { deleteItem, moveItem } from "@/app/admin/actions";

export type Row = { id: string; title: string; meta: string; group?: string };

type Props = {
  collection: string;
  rows: Row[];
  /** Show up/down controls (collections without an automatic order). */
  reorder: boolean;
  savedId?: string;
  empty: string;
};

export function EntryList({ collection, rows, reorder, savedId, empty }: Props) {
  const [query, setQuery] = useState("");
  const [confirming, setConfirming] = useState<string | null>(null);
  const [error, setError] = useState<string>();
  const [pending, start] = useTransition();

  const needle = query.trim().toLowerCase();
  const visible = needle
    ? rows.filter((r) => `${r.title} ${r.meta} ${r.group ?? ""}`.toLowerCase().includes(needle))
    : rows;

  const remove = (id: string) =>
    start(async () => {
      const result = await deleteItem(collection, id);
      setConfirming(null);
      setError(result?.error);
    });
  const move = (id: string, direction: -1 | 1) => start(() => moveItem(collection, id, direction));

  if (!rows.length)
    return <p className="rounded-xl border border-dashed border-line-strong p-10 text-center text-fg-2">{empty}</p>;

  return (
    <div>
      {rows.length > 8 && (
        <label className="relative mb-4 block sm:max-w-xs">
          <span className="sr-only">Filter</span>
          <LuSearch
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Filter ${rows.length} items…`}
            className="field-input pl-9"
          />
        </label>
      )}

      {error && (
        <p role="alert" className="mb-4 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-fg">
          {error}
        </p>
      )}

      <ul className="overflow-hidden rounded-xl border border-line bg-surface" aria-busy={pending}>
        {visible.map((row, i) => {
          const showGroup = row.group !== undefined && row.group !== visible[i - 1]?.group;
          const index = rows.indexOf(row);
          return (
            <li key={row.id}>
              {showGroup && (
                <p className="border-b border-line bg-surface-2/60 px-4 py-2 text-[12px] font-semibold tracking-wide text-muted uppercase">
                  {row.group}
                </p>
              )}
              <div
                className={`flex items-center gap-2 border-b border-line py-2 pr-2 pl-4 ${
                  row.id === savedId ? "bg-success-soft" : ""
                } ${i === visible.length - 1 ? "border-b-0" : ""}`}
              >
                <Link href={`/admin/${collection}/${row.id}/`} className="group min-w-0 flex-1 py-1">
                  <span className="line-clamp-2 font-medium text-fg group-hover:text-primary">{row.title}</span>
                  {row.meta && <span className="mt-0.5 block truncate text-[13px] text-muted">{row.meta}</span>}
                </Link>

                {confirming === row.id ? (
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="hidden text-sm text-fg-2 sm:inline">Delete?</span>
                    <button
                      type="button"
                      className="btn btn-danger px-2.5 py-1"
                      disabled={pending}
                      onClick={() => remove(row.id)}
                    >
                      Delete
                    </button>
                    <button type="button" className="btn btn-secondary px-2.5 py-1" onClick={() => setConfirming(null)}>
                      Keep
                    </button>
                  </span>
                ) : (
                  <span className="flex shrink-0 items-center">
                    {reorder && !needle && (
                      <>
                        <button
                          type="button"
                          className="btn-icon"
                          disabled={pending || index === 0 || rows[index - 1].group !== row.group}
                          onClick={() => move(row.id, -1)}
                          aria-label={`Move “${row.title}” up`}
                        >
                          <LuArrowUp className="size-4" aria-hidden />
                        </button>
                        <button
                          type="button"
                          className="btn-icon"
                          disabled={pending || index === rows.length - 1 || rows[index + 1].group !== row.group}
                          onClick={() => move(row.id, 1)}
                          aria-label={`Move “${row.title}” down`}
                        >
                          <LuArrowDown className="size-4" aria-hidden />
                        </button>
                      </>
                    )}
                    <Link
                      href={`/admin/${collection}/${row.id}/`}
                      className="btn-icon"
                      aria-label={`Edit “${row.title}”`}
                    >
                      <LuPencil className="size-4" aria-hidden />
                    </Link>
                    <button
                      type="button"
                      className="btn-icon hover:!text-danger"
                      onClick={() => {
                        setError(undefined);
                        setConfirming(row.id);
                      }}
                      aria-label={`Delete “${row.title}”`}
                    >
                      <LuTrash2 className="size-4" aria-hidden />
                    </button>
                  </span>
                )}
              </div>
            </li>
          );
        })}
        {!visible.length && <li className="p-8 text-center text-fg-2">Nothing matches “{query}”.</li>}
      </ul>
    </div>
  );
}
