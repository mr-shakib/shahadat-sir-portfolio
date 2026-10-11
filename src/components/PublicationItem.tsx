"use client";

import { useState } from "react";
import { LuArrowUpRight, LuCheck, LuCopy, LuQuote } from "react-icons/lu";
import { pubTypeLabel } from "@/content/labels";
import type { Publication } from "@/content/types";
import { pubLink, toApa, toBibtex } from "@/lib/cite";
import { Authors } from "./Authors";

const typeTone: Record<Publication["type"], string> = {
  journal: "bg-primary-soft text-primary",
  chapter: "bg-gold-soft text-gold",
  conference: "bg-surface-2 text-fg-2",
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        } catch {
          /* clipboard blocked: the text is still selectable */
        }
      }}
      className="inline-flex items-center gap-1 rounded-md border border-line bg-surface px-2 py-1 text-xs font-medium text-fg-2 transition hover:border-line-strong hover:text-fg"
    >
      {done ? <LuCheck className="size-3.5 text-primary" aria-hidden /> : <LuCopy className="size-3.5" aria-hidden />}
      {done ? "Copied" : label}
    </button>
  );
}

export function PublicationItem({
  pub,
  selfNames,
  index,
  compact = false,
}: {
  pub: Publication;
  selfNames: string[];
  index?: number;
  compact?: boolean;
}) {
  const [cite, setCite] = useState(false);
  const link = pubLink(pub);
  const meta = [pub.series, pub.pages && `pp. ${pub.pages}`].filter(Boolean).join(" · ");

  return (
    <article className="group relative flex gap-4 sm:gap-6">
      {index !== undefined && (
        <span className="hidden w-8 shrink-0 pt-1 text-right font-serif text-sm text-muted tabular-nums sm:block">
          [{index}]
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-[11.5px] font-semibold tracking-wide uppercase">
          <span className={`rounded-full px-2 py-0.5 ${typeTone[pub.type]}`}>{pubTypeLabel[pub.type]}</span>
          {pub.publisher && <span className="text-muted">{pub.publisher}</span>}
          {pub.scopus && (
            <span className="rounded-full border border-line px-2 py-0.5 text-muted normal-case">Scopus-indexed</span>
          )}
        </div>

        <h3 className="mt-2 font-serif text-[1.15rem] leading-snug font-medium text-fg sm:text-[1.25rem]">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="decoration-primary/40 underline-offset-4 transition hover:text-primary hover:underline"
            >
              {pub.title}
            </a>
          ) : (
            pub.title
          )}
        </h3>

        <p className="mt-1.5 text-[14.5px] leading-relaxed text-fg-2">
          <Authors authors={pub.authors} selfNames={selfNames} />
        </p>

        <p className="mt-1 text-[14px] leading-relaxed text-muted">
          <em className="text-fg-2">{pub.venue}</em>
          {meta && <> · {meta}</>}
          {pub.location && <> · {pub.location}</>} · {pub.year}
        </p>

        {!compact && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-line bg-surface px-2 py-1 text-xs font-medium text-fg-2 transition hover:border-primary/40 hover:text-primary"
              >
                {pub.doi ? "DOI" : "Link"}
                <LuArrowUpRight className="size-3.5" aria-hidden />
              </a>
            )}
            <button
              type="button"
              aria-expanded={cite}
              onClick={() => setCite((v) => !v)}
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition ${
                cite
                  ? "border-primary/40 bg-primary-soft text-primary"
                  : "border-line bg-surface text-fg-2 hover:border-line-strong hover:text-fg"
              }`}
            >
              <LuQuote className="size-3.5" aria-hidden /> Cite
            </button>
            {pub.doi && <span className="font-mono text-[11.5px] text-muted">{pub.doi}</span>}
          </div>
        )}

        {cite && (
          <div className="mt-3 space-y-3 rounded-xl border border-line bg-surface-2 p-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">APA</p>
                <CopyButton text={toApa(pub)} label="Copy" />
              </div>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-fg-2 select-all">{toApa(pub)}</p>
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">BibTeX</p>
                <CopyButton text={toBibtex(pub)} label="Copy" />
              </div>
              <pre className="mt-1.5 overflow-x-auto rounded-lg bg-surface p-3 font-mono text-[12px] leading-relaxed text-fg-2">
                {toBibtex(pub)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
