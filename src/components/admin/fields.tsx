"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import {
  LuArrowDown,
  LuArrowLeft,
  LuArrowRight,
  LuArrowUp,
  LuFileText,
  LuImage,
  LuPlus,
  LuUpload,
  LuX,
} from "react-icons/lu";
import type { Field } from "@/content/schema";
import { optionList, type Errors, type SourceOptions } from "@/content/validate";
import type { UploadConfig } from "@/lib/env";
import { MarkdownEditor } from "./MarkdownEditor";
import { uploadOne } from "./upload";

export type Path = (string | number)[];

type FormContext = {
  errors: Errors;
  sources: SourceOptions;
  set: (path: Path, value: unknown) => void;
  /** Tracks uploads in flight, so saving waits for them. */
  uploading: (delta: 1 | -1) => void;
  uploads: UploadConfig;
};

export const FormCtx = createContext<FormContext | null>(null);
const useForm = () => useContext(FormCtx)!;

export const fieldId = (path: Path) => `field-${path.join("-")}`;
const errorKey = (path: Path) => path.join(".");
const str = (v: unknown) => (typeof v === "string" ? v : typeof v === "number" ? String(v) : "");
const arr = (v: unknown) => (Array.isArray(v) ? v : []);

const span = (f: Field) => {
  if (f.type === "group" || f.type === "list" || f.type === "images" || f.type === "markdown") return "sm:col-span-6";
  return f.width === "half" ? "sm:col-span-3" : f.width === "third" ? "sm:col-span-2" : "sm:col-span-6";
};

/** A grid of fields for one record (or one nested group / list item). */
export function Fields({ fields, value, path }: { fields: readonly Field[]; value: unknown; path: Path }) {
  const record = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  return (
    <div className="grid gap-x-4 gap-y-6 sm:grid-cols-6">
      {fields.map((f) => (
        <div key={f.name} className={`min-w-0 ${span(f)}`}>
          <FieldControl field={f} value={record[f.name]} path={[...path, f.name]} />
        </div>
      ))}
    </div>
  );
}

function Label({ field, path, as = "label" }: { field: Field; path: Path; as?: "label" | "p" }) {
  const Tag = as;
  return (
    <Tag
      {...(as === "label" ? { htmlFor: fieldId(path) } : { id: `${fieldId(path)}-label` })}
      className="mb-1.5 block text-sm font-medium text-fg"
    >
      {field.label}
      {field.required && (
        <span className="text-danger" aria-hidden>
          {" "}
          *
        </span>
      )}
    </Tag>
  );
}

function Help({ field, path, error }: { field: Field; path: Path; error?: string }) {
  return (
    <>
      {error && (
        <p id={`${fieldId(path)}-error`} className="mt-1.5 text-[13px] font-medium text-danger">
          {error}
        </p>
      )}
      {field.help && (
        <p id={`${fieldId(path)}-help`} className="mt-1.5 text-[13px] leading-snug text-muted">
          {field.help}
        </p>
      )}
    </>
  );
}

function FieldControl({ field: f, value, path }: { field: Field; value: unknown; path: Path }) {
  const { errors, sources, set, uploading, uploads } = useForm();
  const error = errors[errorKey(path)];
  const id = fieldId(path);
  const a11y = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": [error && `${id}-error`, f.help && `${id}-help`].filter(Boolean).join(" ") || undefined,
    "aria-required": f.required || undefined,
  };

  switch (f.type) {
    case "text": {
      const suggestions = f.suggest ? (sources[`${f.suggest.from}.${f.suggest.value}`] ?? []) : [];
      return (
        <>
          <Label field={f} path={path} />
          <input
            {...a11y}
            type={f.input === "email" ? "email" : f.input === "url" ? "url" : f.input === "tel" ? "tel" : "text"}
            value={str(value)}
            placeholder={f.placeholder}
            list={suggestions.length ? `${id}-list` : undefined}
            onChange={(e) => set(path, e.target.value)}
            className="field-input"
          />
          {suggestions.length > 0 && (
            <datalist id={`${id}-list`}>
              {suggestions.map((o) => (
                <option key={o.value} value={o.value} />
              ))}
            </datalist>
          )}
          <Help field={f} path={path} error={error} />
        </>
      );
    }

    case "textarea":
      return (
        <>
          <Label field={f} path={path} />
          <textarea
            {...a11y}
            value={str(value)}
            placeholder={f.placeholder}
            onChange={(e) => set(path, e.target.value)}
            style={{ minHeight: `${(f.rows ?? 4) * 1.5 + 1.1}rem` }}
            className="field-input field-sizing-content"
          />
          <Help field={f} path={path} error={error} />
        </>
      );

    case "markdown":
      return (
        <>
          <Label field={f} path={path} />
          <MarkdownEditor
            id={id}
            value={str(value)}
            onChange={(v) => set(path, v)}
            invalid={Boolean(error)}
            describedBy={a11y["aria-describedby"]}
            uploading={uploading}
            uploads={uploads}
          />
          <Help field={f} path={path} error={error} />
        </>
      );

    case "number":
      return (
        <>
          <Label field={f} path={path} />
          <input
            {...a11y}
            type="number"
            inputMode="numeric"
            min={f.min}
            max={f.max}
            value={str(value)}
            placeholder={f.placeholder}
            onChange={(e) => set(path, e.target.value === "" ? undefined : Number(e.target.value))}
            className="field-input"
          />
          <Help field={f} path={path} error={error} />
        </>
      );

    case "checkbox":
      return (
        <div className="sm:pt-7">
          <label className="flex items-start gap-2.5 text-sm font-medium text-fg">
            <input
              {...a11y}
              type="checkbox"
              checked={value === true}
              onChange={(e) => set(path, e.target.checked ? true : undefined)}
              className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]"
            />
            {f.label}
          </label>
          <Help field={f} path={path} error={error} />
        </div>
      );

    case "select": {
      const options = optionList(f.options, sources);
      const current = str(value);
      return (
        <>
          <Label field={f} path={path} />
          <select
            {...a11y}
            value={current}
            onChange={(e) => set(path, e.target.value || undefined)}
            className="field-input"
          >
            <option value="">Choose…</option>
            {current && !options.some((o) => o.value === current) && (
              <option value={current}>{current} (no longer listed)</option>
            )}
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Help field={f} path={path} error={error} />
        </>
      );
    }

    case "multiselect": {
      const options = optionList(f.options, sources);
      const selected = arr(value).map(str);
      return (
        <>
          <Label field={f} path={path} as="p" />
          <div role="group" aria-labelledby={`${id}-label`} className="flex flex-wrap gap-2">
            {options.map((o) => {
              const on = selected.includes(o.value);
              return (
                <label
                  key={o.value}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-[13.5px] font-medium transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
                    on
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-line-strong bg-surface text-fg-2 hover:text-fg"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={on}
                    onChange={() => set(path, on ? selected.filter((v) => v !== o.value) : [...selected, o.value])}
                  />
                  {o.label}
                </label>
              );
            })}
            {!options.length && <p className="text-sm text-muted">No options yet.</p>}
          </div>
          <Help field={f} path={path} error={error} />
        </>
      );
    }

    case "strings":
      return f.lines ? (
        <>
          <Label field={f} path={path} />
          <textarea
            {...a11y}
            value={arr(value).map(str).join("\n")}
            placeholder={f.placeholder}
            onChange={(e) => set(path, e.target.value.split("\n"))}
            style={{ minHeight: "5.6rem" }}
            className="field-input field-sizing-content"
          />
          <Help field={f} path={path} error={error} />
        </>
      ) : (
        <>
          <Label field={f} path={path} as="p" />
          <Repeater
            items={arr(value)}
            path={path}
            noun={f.itemLabel ?? "item"}
            blank=""
            render={(item, i) =>
              f.multiline ? (
                <textarea
                  id={fieldId([...path, i])}
                  aria-label={`${f.itemLabel ?? "Item"} ${i + 1}`}
                  value={str(item)}
                  onChange={(e) => set([...path, i], e.target.value)}
                  style={{ minHeight: "5.6rem" }}
                  className="field-input field-sizing-content"
                />
              ) : (
                <input
                  id={fieldId([...path, i])}
                  aria-label={`${f.itemLabel ?? "Item"} ${i + 1}`}
                  value={str(item)}
                  onChange={(e) => set([...path, i], e.target.value)}
                  className="field-input"
                />
              )
            }
          />
          <Help field={f} path={path} error={error} />
        </>
      );

    case "list":
      return (
        <>
          <Label field={f} path={path} as="p" />
          <Repeater
            items={arr(value)}
            path={path}
            noun={f.itemLabel.toLowerCase()}
            blank={{}}
            boxed
            title={(i) => `${f.itemLabel} ${i + 1}`}
            render={(item, i) => <Fields fields={f.fields} value={item} path={[...path, i]} />}
          />
          <Help field={f} path={path} error={error} />
        </>
      );

    case "group":
      return (
        <fieldset className="rounded-xl border border-line p-4 sm:p-5">
          <legend className="px-1.5 text-sm font-semibold text-fg">{f.label}</legend>
          {f.help && <p className="mb-4 text-[13px] text-muted">{f.help}</p>}
          <Fields fields={f.fields} value={value} path={path} />
        </fieldset>
      );

    case "image":
      return (
        <>
          <Label field={f} path={path} as="p" />
          <div className="flex items-start gap-4">
            <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface-2">
              {str(value) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={str(value)} alt="" className="size-full object-cover" />
              ) : (
                <LuImage className="size-6 text-muted" aria-hidden />
              )}
            </div>
            <div className="min-w-0 space-y-2">
              <Upload
                id={id}
                kind="image"
                label={str(value) ? "Replace photo" : "Upload photo"}
                onUploaded={(urls) => set(path, urls[0])}
              />
              {str(value) && !f.required && (
                <button
                  type="button"
                  className="block text-sm text-muted hover:text-danger"
                  onClick={() => set(path, undefined)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          <Help field={f} path={path} error={error} />
        </>
      );

    case "images": {
      const images = arr(value).map(str);
      const move = (i: number, d: number) => {
        const next = [...images];
        [next[i], next[i + d]] = [next[i + d], next[i]];
        set(path, next);
      };
      return (
        <>
          <Label field={f} path={path} as="p" />
          {images.length > 0 && (
            <ul className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {images.map((src, i) => (
                <li key={`${src}-${i}`} className="overflow-hidden rounded-lg border border-line bg-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="aspect-[4/3] w-full bg-surface-2 object-cover" />
                  <div className="flex items-center justify-between px-1 py-1">
                    <span className="pl-1.5 text-xs text-muted">{i === 0 ? "Cover" : i + 1}</span>
                    <span className="flex">
                      <button
                        type="button"
                        className="btn-icon size-7"
                        disabled={i === 0}
                        onClick={() => move(i, -1)}
                        aria-label={`Move photo ${i + 1} earlier`}
                      >
                        <LuArrowLeft className="size-3.5" aria-hidden />
                      </button>
                      <button
                        type="button"
                        className="btn-icon size-7"
                        disabled={i === images.length - 1}
                        onClick={() => move(i, 1)}
                        aria-label={`Move photo ${i + 1} later`}
                      >
                        <LuArrowRight className="size-3.5" aria-hidden />
                      </button>
                      <button
                        type="button"
                        className="btn-icon size-7 hover:!text-danger"
                        onClick={() =>
                          set(
                            path,
                            images.filter((_, j) => j !== i),
                          )
                        }
                        aria-label={`Remove photo ${i + 1}`}
                      >
                        <LuX className="size-3.5" aria-hidden />
                      </button>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Upload
            id={id}
            kind="image"
            multiple
            label="Add photos"
            onUploaded={(urls) => set(path, [...images, ...urls])}
          />
          <Help field={f} path={path} error={error} />
        </>
      );
    }

    case "file":
      return (
        <>
          <Label field={f} path={path} as="p" />
          <div className="flex flex-wrap items-center gap-3">
            {str(value) && (
              <a
                href={str(value)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-0 items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg hover:border-primary/40"
              >
                <LuFileText className="size-4 shrink-0 text-primary" aria-hidden />
                <span className="truncate">{decodeURIComponent(str(value).split("/").pop() ?? "")}</span>
              </a>
            )}
            <Upload
              id={id}
              kind="file"
              accept={f.accept}
              label={str(value) ? "Replace file" : "Upload file"}
              onUploaded={(urls) => set(path, urls[0])}
            />
          </div>
          <Help field={f} path={path} error={error} />
        </>
      );
  }
}

/** Add / remove / reorder rows of a list field. */
function Repeater({
  items,
  path,
  noun,
  blank,
  boxed = false,
  title,
  render,
}: {
  items: unknown[];
  path: Path;
  noun: string;
  blank: unknown;
  boxed?: boolean;
  title?: (i: number) => string;
  render: (item: unknown, i: number) => ReactNode;
}) {
  const { set } = useForm();
  const move = (i: number, d: number) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    set(path, next);
  };
  const controls = (i: number) => (
    <span className="flex shrink-0">
      <button
        type="button"
        className="btn-icon"
        disabled={i === 0}
        onClick={() => move(i, -1)}
        aria-label={`Move ${noun} ${i + 1} up`}
      >
        <LuArrowUp className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        className="btn-icon"
        disabled={i === items.length - 1}
        onClick={() => move(i, 1)}
        aria-label={`Move ${noun} ${i + 1} down`}
      >
        <LuArrowDown className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        className="btn-icon hover:!text-danger"
        onClick={() =>
          set(
            path,
            items.filter((_, j) => j !== i),
          )
        }
        aria-label={`Remove ${noun} ${i + 1}`}
      >
        <LuX className="size-4" aria-hidden />
      </button>
    </span>
  );

  return (
    <div>
      {items.length > 0 && (
        <ol className={boxed ? "mb-3 space-y-3" : "mb-2 space-y-2"}>
          {items.map((item, i) =>
            boxed ? (
              <li key={i} className="rounded-xl border border-line bg-bg/60 p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold text-muted">{title?.(i)}</span>
                  {controls(i)}
                </div>
                {render(item, i)}
              </li>
            ) : (
              <li key={i} className="flex items-start gap-1">
                <div className="min-w-0 flex-1">{render(item, i)}</div>
                {controls(i)}
              </li>
            ),
          )}
        </ol>
      )}
      <button type="button" className="btn btn-secondary py-1.5" onClick={() => set(path, [...items, blank])}>
        <LuPlus className="size-4" aria-hidden /> Add {noun}
      </button>
    </div>
  );
}

/** File picker that uploads straight away and reports the stored URLs. */
function Upload({
  id,
  kind,
  label,
  accept,
  multiple = false,
  onUploaded,
}: {
  id: string;
  kind: "image" | "file";
  label: string;
  accept?: string;
  multiple?: boolean;
  onUploaded: (urls: string[]) => void;
}) {
  const { uploading, uploads } = useForm();
  const input = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>();
  const [error, setError] = useState<string>();

  const pick = async (files: File[]) => {
    if (!files.length) return;
    setError(undefined);
    uploading(1);
    const urls: string[] = [];
    const problems: string[] = [];
    try {
      for (const [i, file] of files.entries()) {
        setStatus(files.length > 1 ? `Uploading ${i + 1} of ${files.length}…` : "Uploading…");
        const result = await uploadOne(file, kind, uploads);
        if ("url" in result) urls.push(result.url);
        else
          problems.push(
            files.length > 1 && !result.error.includes(file.name) ? `${file.name}: ${result.error}` : result.error,
          );
      }
    } finally {
      uploading(-1);
      setStatus(undefined);
      if (input.current) input.current.value = "";
    }
    if (urls.length) onUploaded(urls);
    if (problems.length) setError(problems.join(" "));
  };

  return (
    <div>
      <input
        ref={input}
        id={id}
        type="file"
        className="peer sr-only"
        accept={accept ?? (kind === "image" ? "image/jpeg,image/png,image/webp" : undefined)}
        multiple={multiple}
        disabled={Boolean(status)}
        aria-labelledby={`${id}-label ${id}-button`}
        onChange={(e) => pick(Array.from(e.target.files ?? []))}
      />
      <label
        htmlFor={id}
        id={`${id}-button`}
        className={`btn btn-secondary cursor-pointer py-1.5 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary ${status ? "pointer-events-none opacity-60" : ""}`}
      >
        <LuUpload className="size-4" aria-hidden /> {status ?? label}
      </label>
      {error && (
        <p role="alert" className="mt-1.5 text-[13px] font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
