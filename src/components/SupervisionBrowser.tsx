"use client";

import { useState } from "react";
import { LuAward } from "react-icons/lu";
import { supervisionGroups } from "@/content/derive";
import type { Institution, SupervisedWork, WithId } from "@/content/types";

type Props = { items: WithId<SupervisedWork>[]; institutions: Institution[] };

export function SupervisionBrowser({ items, institutions }: Props) {
  const [domain, setDomain] = useState<string>("all");
  const [kind, setKind] = useState<"all" | "Thesis" | "Project">("all");

  const domains = Array.from(new Set(items.map((i) => i.domain)));
  const groups = supervisionGroups(items, institutions)
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => (domain === "all" || i.domain === domain) && (kind === "all" || i.kind === kind)),
    }))
    .filter((g) => g.items.length);

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition ${
      active ? "border-fg bg-fg text-bg" : "border-line bg-surface text-fg-2 hover:border-line-strong hover:text-fg"
    }`;

  return (
    <div>
      <div className="card flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:pb-0">
          <button
            type="button"
            aria-pressed={domain === "all"}
            className={chip(domain === "all")}
            onClick={() => setDomain("all")}
          >
            All areas
          </button>
          {domains.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={domain === d}
              className={chip(domain === d)}
              onClick={() => setDomain(d)}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(["all", "Thesis", "Project"] as const).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={kind === k}
              className={chip(kind === k)}
              onClick={() => setKind(k)}
            >
              {k === "all" ? "Both" : `${k === "Thesis" ? "Theses" : "Projects"}`}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 space-y-12" aria-live="polite">
        {groups.length === 0 && <p className="card p-8 text-center text-fg-2">Nothing matches these filters.</p>}
        {groups.map((g) => (
          <section key={`${g.institution}-${g.term ?? ""}`} className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
            <div className="md:sticky md:top-24 md:self-start">
              <h2 className="font-serif text-xl leading-snug font-medium text-fg">{g.institution}</h2>
              <p className="mt-1 text-sm text-muted">
                {[g.term ?? g.period, `${g.items.length} supervised`].filter(Boolean).join(" · ")}
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {g.items.map((i) => (
                <li
                  key={i.id}
                  className={`card flex flex-col p-5 ${i.outcome ? "border-gold-bright/50 sm:col-span-2" : ""}`}
                >
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold tracking-wide uppercase">
                    <span
                      className={`rounded-full px-2 py-0.5 ${
                        i.kind === "Thesis" ? "bg-primary-soft text-primary" : "bg-surface-2 text-fg-2"
                      }`}
                    >
                      {i.kind}
                    </span>
                    <span className="text-muted">{i.domain}</span>
                  </div>
                  <p className="mt-2.5 leading-snug font-medium text-fg">{i.title}</p>
                  {i.outcome && (
                    <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-gold">
                      <LuAward className="size-4" aria-hidden /> {i.outcome}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
