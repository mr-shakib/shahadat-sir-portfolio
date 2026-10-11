"use client";

import { useState } from "react";
import { splitCourse } from "@/content/derive";
import type { Institution, Semester } from "@/content/types";

type Props = { history: (Institution & { semesters: Semester[] })[] };

export function TeachingHistory({ history }: Props) {
  const [active, setActive] = useState(0);
  const inst = history[active];
  if (!inst) return null;

  return (
    <div>
      <div role="tablist" aria-label="Institution" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {history.map((t, i) => (
          <button
            key={t.name}
            role="tab"
            id={`tab-${i}`}
            aria-selected={active === i}
            aria-controls={`panel-${i}`}
            onClick={() => setActive(i)}
            className={`shrink-0 rounded-2xl border px-4 py-3 text-left transition ${
              active === i ? "border-primary/40 bg-primary-soft" : "border-line bg-surface hover:border-line-strong"
            }`}
          >
            <span className={`block text-sm font-semibold ${active === i ? "text-primary" : "text-fg"}`}>{t.name}</span>
            <span className="block text-xs text-muted">
              {t.period} · {t.semesters.length} semesters
            </span>
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`} className="mt-6">
        <p className="text-sm text-muted">{inst.role}</p>
        <ol className="mt-4 grid gap-4 md:grid-cols-2">
          {inst.semesters.map((s) => (
            <li key={s.term} className="card p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-serif text-lg font-medium text-fg">{s.term}</h3>
                <span className="text-xs text-muted">{s.courses.length} courses</span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {s.courses.map((c) => {
                  const { code, title } = splitCourse(c);
                  return (
                    <li key={c} className="flex gap-3 text-[14px] leading-snug">
                      <span className="w-[68px] shrink-0 font-mono text-[12px] text-muted">{code}</span>
                      <span className="text-fg-2">{title}</span>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
