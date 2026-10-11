"use client";

import { useRef, useState, useTransition, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import type { IconType } from "react-icons";
import {
  LuBold,
  LuCode,
  LuHeading2,
  LuHeading3,
  LuImagePlus,
  LuItalic,
  LuLink,
  LuList,
  LuListOrdered,
  LuSquareCode,
} from "react-icons/lu";
import { previewMarkdown } from "@/app/admin/actions";
import type { UploadConfig } from "@/lib/env";
import { uploadOne } from "./upload";

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
  /** Tracks uploads in flight, so the form waits for them before saving. */
  uploading: (delta: 1 | -1) => void;
  uploads: UploadConfig;
};

type Edit = { text: string; start: number; end: number };

const lineBounds = (t: string, s: number, e: number) => {
  const start = t.lastIndexOf("\n", s - 1) + 1;
  const next = t.indexOf("\n", e);
  return { start, end: next === -1 ? t.length : next };
};

/** Markdown textarea with a formatting toolbar, image upload and a rendered preview. */
export function MarkdownEditor({ id, value, onChange, invalid, describedBy, uploading, uploads }: Props) {
  const area = useRef<HTMLTextAreaElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState<string>();
  const [error, setError] = useState<string>();
  const [rendering, startPreview] = useTransition();

  const apply = (edit: (text: string, start: number, end: number) => Edit) => {
    const el = area.current;
    if (!el) return;
    const r = edit(el.value, el.selectionStart, el.selectionEnd);
    // Commit the new text now, so the cursor can be placed before the next keystroke arrives.
    flushSync(() => onChange(r.text));
    el.focus();
    el.setSelectionRange(r.start, r.end);
  };

  const wrap = (before: string, after = before, placeholder = "text") =>
    apply((t, s, e) => {
      const sel = t.slice(s, e) || placeholder;
      return {
        text: t.slice(0, s) + before + sel + after + t.slice(e),
        start: s + before.length,
        end: s + before.length + sel.length,
      };
    });

  const prefixLines = (prefix: (i: number) => string) =>
    apply((t, s, e) => {
      const { start, end } = lineBounds(t, s, e);
      const lines = t
        .slice(start, end)
        .split("\n")
        .map((l, i) => prefix(i) + l.replace(/^(#{1,6} |- |\d+\. )/, ""));
      const out = lines.join("\n");
      // With nothing selected, leave the cursor at the end of the line so typing continues there.
      const caret = s === e ? start + out.length : start;
      return { text: t.slice(0, start) + out + t.slice(end), start: caret, end: start + out.length };
    });

  /** Inserts a block on its own lines at the cursor (or around the selection). */
  const insertBlock = (before: string, after: string, placeholder: string) =>
    apply((t, s, e) => {
      const sel = t.slice(s, e) || placeholder;
      const gap = s > 0 && t[s - 1] !== "\n" ? "\n\n" : s > 1 && t[s - 2] !== "\n" ? "\n" : "";
      const text = t.slice(0, s) + gap + before + sel + after + t.slice(e);
      const at = s + gap.length + before.length;
      return { text, start: at, end: at + sel.length };
    });

  const link = () =>
    apply((t, s, e) => {
      const label = t.slice(s, e) || "link text";
      const text = `${t.slice(0, s)}[${label}](https://)${t.slice(e)}`;
      const url = s + label.length + 3;
      return { text, start: url, end: url + 8 };
    });

  const uploadImages = async (files: File[]) => {
    if (!files.length) return;
    setError(undefined);
    uploading(1);
    const snippets: string[] = [];
    try {
      for (const [i, file] of files.entries()) {
        setStatus(files.length > 1 ? `Uploading ${i + 1} of ${files.length}…` : "Uploading…");
        const result = await uploadOne(file, "image", uploads);
        if ("url" in result) snippets.push(`![${file.name.replace(/\.[^.]+$/, "")}](${result.url})`);
        else setError(result.error);
      }
    } finally {
      uploading(-1);
      setStatus(undefined);
      if (picker.current) picker.current.value = "";
    }
    if (snippets.length) insertBlock("", "\n\n", snippets.join("\n\n"));
  };

  const tools: { label: string; icon: IconType; run: () => void; keys?: string }[] = [
    { label: "Heading", icon: LuHeading2, run: () => prefixLines(() => "## ") },
    { label: "Subheading", icon: LuHeading3, run: () => prefixLines(() => "### ") },
    { label: "Bold", icon: LuBold, run: () => wrap("**"), keys: "Ctrl+B" },
    { label: "Italic", icon: LuItalic, run: () => wrap("*"), keys: "Ctrl+I" },
    { label: "Bulleted list", icon: LuList, run: () => prefixLines(() => "- ") },
    { label: "Numbered list", icon: LuListOrdered, run: () => prefixLines((i) => `${i + 1}. `) },
    { label: "Link", icon: LuLink, run: link, keys: "Ctrl+K" },
    { label: "Code in a sentence", icon: LuCode, run: () => wrap("`", "`", "code") },
    { label: "Code block", icon: LuSquareCode, run: () => insertBlock("```\n", "\n```\n", "your code here") },
    { label: "Image", icon: LuImagePlus, run: () => picker.current?.click() },
  ];

  const onKeyDown = (e: KeyboardEvent) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const key = e.key.toLowerCase();
    const run = key === "b" ? () => wrap("**") : key === "i" ? () => wrap("*") : key === "k" ? link : null;
    if (run) {
      e.preventDefault();
      run();
    }
  };

  const showPreview = () => {
    setTab("preview");
    startPreview(async () => setPreview(await previewMarkdown(value)));
  };

  const tabClass = (on: boolean) =>
    `rounded-md px-3 py-1 text-[13px] font-semibold transition ${on ? "bg-surface text-fg shadow-card" : "text-muted hover:text-fg"}`;

  return (
    <div className={`overflow-hidden rounded-xl border ${invalid ? "border-danger" : "border-line-strong"} bg-surface`}>
      <div className="sticky top-14 z-10 flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface-2/95 px-2 py-1.5 backdrop-blur lg:top-0">
        <div role="toolbar" aria-label="Formatting" aria-controls={id} className="flex flex-wrap items-center">
          {tools.map(({ label, icon: Icon, run, keys }) => (
            <button
              key={label}
              type="button"
              className="btn-icon"
              title={keys ? `${label} (${keys})` : label}
              aria-label={label}
              disabled={tab === "preview" || Boolean(status)}
              onClick={run}
            >
              <Icon className="size-4" aria-hidden />
            </button>
          ))}
          {status && <span className="px-2 text-[13px] text-muted">{status}</span>}
        </div>
        <div className="flex rounded-lg bg-bg p-0.5" role="tablist" aria-label="Editor mode">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "write"}
            className={tabClass(tab === "write")}
            onClick={() => setTab("write")}
          >
            Write
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "preview"}
            className={tabClass(tab === "preview")}
            onClick={showPreview}
          >
            Preview
          </button>
        </div>
      </div>

      <input
        ref={picker}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => uploadImages(Array.from(e.target.files ?? []))}
      />

      {tab === "write" ? (
        <textarea
          ref={area}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          spellCheck
          placeholder="Write the lecture notes here…"
          className="field-sizing-content block max-h-[75vh] min-h-[22rem] w-full resize-y bg-transparent px-4 py-3 font-mono text-[13.5px] leading-relaxed text-fg focus:outline-none"
        />
      ) : (
        <div className="max-h-[75vh] min-h-[22rem] overflow-y-auto px-5 py-4" aria-busy={rendering}>
          {rendering && !preview ? (
            <p className="text-sm text-muted">Rendering preview…</p>
          ) : preview.trim() ? (
            <div className="prose-lecture" dangerouslySetInnerHTML={{ __html: preview }} />
          ) : (
            <p className="text-sm text-muted">Nothing to preview yet.</p>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="border-t border-line px-4 py-2 text-[13px] font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
