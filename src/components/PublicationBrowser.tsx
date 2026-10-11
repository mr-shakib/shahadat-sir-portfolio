"use client";

import { useMemo, useState } from "react";
import { LuSearch, LuX } from "react-icons/lu";
import type { PubType, Publication, ResearchTheme, WithId } from "@/content/types";
import { PublicationItem } from "./PublicationItem";
import { YearChart } from "./YearChart";

const typeFilters: { key: PubType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "journal", label: "Journal articles" },
  { key: "chapter", label: "Book chapters" },
  { key: "conference", label: "Conference papers" },
];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition ${
        active ? "border-fg bg-fg text-bg" : "border-line bg-surface text-fg-2 hover:border-line-strong hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}

type Props = { publications: WithId<Publication>[]; themes: ResearchTheme[]; selfNames: string[] };

export function PublicationBrowser({ publications, themes, selfNames }: Props) {
  const [type, setType] = useState<PubType | "all">("all");
  const [theme, setTheme] = useState<string>("all");
  const [year, setYear] = useState<number | null>(null);
  const [q, setQ] = useState("");

  // Everything except the year filter: the chart shows this slice, the list narrows it further.
  const base = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return publications.filter(
      (p) =>
        (type === "all" || p.type === type) &&
        (theme === "all" || p.themes.includes(theme)) &&
        (!needle || [p.title, p.venue, p.publisher ?? "", ...p.authors].join(" ").toLowerCase().includes(needle)),
    );
  }, [publications, type, theme, q]);

  const years = useMemo(() => {
    const all = publications.length ? publications.map((p) => p.year) : [new Date().getFullYear()];
    const out: { year: number; count: number }[] = [];
    for (let y = Math.min(...all); y <= Math.max(...all); y++) {
      out.push({ year: y, count: base.filter((p) => p.year === y).length });
    }
    return out;
  }, [publications, base]);

  const list = year ? base.filter((p) => p.year === year) : base;
  const grouped = useMemo(() => {
    const m = new Map<number, typeof list>();
    [...list].sort((a, b) => b.year - a.year).forEach((p) => m.set(p.year, [...(m.get(p.year) ?? []), p]));
    return [...m.entries()];
  }, [list]);

  const filtered = type !== "all" || theme !== "all" || year !== null || q.trim() !== "";
  const reset = () => {
    setType("all");
    setTheme("all");
    setYear(null);
    setQ("");
  };

  let n = list.length;

  return (
    <div>
      {/* Filters: one row above everything they scope */}
      <div className="card p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:pb-0">
            {typeFilters.map((f) => (
              <Chip key={f.key} active={type === f.key} onClick={() => setType(f.key)}>
                {f.label}
              </Chip>
            ))}
          </div>
          <label className="relative block lg:w-72">
            <span className="sr-only">Search publications</span>
            <LuSearch
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
              aria-hidden
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, author, venue…"
              className="w-full rounded-full border border-line bg-bg py-2 pr-4 pl-9 text-sm text-fg placeholder:text-muted focus:border-primary/50 focus:outline-none"
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <span className="mr-1 text-xs font-semibold tracking-wide text-muted uppercase">Theme</span>
          <Chip active={theme === "all"} onClick={() => setTheme("all")}>
            Any
          </Chip>
          {themes.map((t) => (
            <Chip key={t.key} active={theme === t.key} onClick={() => setTheme(t.key)}>
              {t.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="card order-2 p-5 sm:p-6 lg:order-1">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-semibold text-fg">Publications per year</h2>
              <p className="text-[13px] text-muted">Select a year to filter the list below.</p>
            </div>
            {year !== null && (
              <button
                type="button"
                onClick={() => setYear(null)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
              >
                <LuX className="size-3.5" aria-hidden /> {year}
              </button>
            )}
          </div>
          <div className="mt-5">
            <YearChart data={years} selected={year} onSelect={setYear} />
          </div>
        </div>
        <div className="card order-1 flex flex-col justify-between gap-4 p-5 sm:p-6 lg:order-2">
          <div>
            <p className="text-[13px] text-muted">Showing</p>
            <p className="mt-1 text-5xl font-semibold tracking-tight text-fg">{list.length}</p>
            <p className="mt-1 text-sm text-fg-2">
              of {publications.length} peer-reviewed publications
              {year !== null && <> from {year}</>}
            </p>
            <ul className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
              {typeFilters.slice(1).map((f) => (
                <li key={f.key} className="flex items-center justify-between gap-3">
                  <span className="text-fg-2">{f.label}</span>
                  <span className="font-semibold text-fg tabular-nums">
                    {list.filter((p) => p.type === f.key).length}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {filtered && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-fg-2 transition hover:border-line-strong hover:text-fg"
            >
              <LuX className="size-3.5" aria-hidden /> Clear all filters
            </button>
          )}
        </div>
      </div>

      <div className="mt-12 space-y-12" aria-live="polite">
        {grouped.length === 0 && (
          <div className="card p-10 text-center">
            <p className="font-serif text-xl text-fg">No publications match these filters.</p>
            <button type="button" onClick={reset} className="link mt-3 text-sm font-semibold">
              Clear filters
            </button>
          </div>
        )}
        {grouped.map(([y, items]) => (
          <section key={y} aria-labelledby={`y-${y}`} className="grid gap-6 md:grid-cols-[120px_minmax(0,1fr)]">
            <div className="md:sticky md:top-24 md:self-start">
              <h2 id={`y-${y}`} className="font-serif text-3xl font-medium text-fg">
                {y}
              </h2>
              <p className="text-sm text-muted">
                {items.length} item{items.length === 1 ? "" : "s"}
              </p>
            </div>
            <ol className="divide-y divide-line border-t border-line">
              {items.map((p) => (
                <li key={p.id} className="py-6">
                  <PublicationItem pub={p} selfNames={selfNames} index={n--} />
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
