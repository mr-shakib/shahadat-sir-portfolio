"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { deleteItem, saveItem } from "@/app/admin/actions";
import { specs, type Spec } from "@/content/schema";
import type { CollectionKey } from "@/content/types";
import { validate, type Errors, type SourceOptions } from "@/content/validate";
import type { UploadConfig } from "@/lib/env";
import { fieldId, Fields, FormCtx, type Path } from "./fields";

type Props = {
  collection: CollectionKey;
  /** Set when editing an existing item. */
  id?: string;
  initial: Record<string, unknown>;
  updatedAt?: string;
  sources: SourceOptions;
  /** Where uploads go, from the server environment. */
  uploads: UploadConfig;
};

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** Immutable set at a path; `undefined` removes the key. */
function setIn(target: unknown, path: Path, value: unknown): unknown {
  if (!path.length) return value;
  const [key, ...rest] = path;
  if (typeof key === "number") {
    const next = Array.isArray(target) ? [...target] : [];
    next[key] = setIn(next[key], rest, value);
    return next;
  }
  const next = isRecord(target) ? { ...target } : {};
  const v = setIn(next[key], rest, value);
  if (v === undefined) delete next[key];
  else next[key] = v;
  return next;
}

function focusFirstError(errors: Errors) {
  const first = Object.keys(errors)[0];
  if (!first) return;
  requestAnimationFrame(() => {
    const el = document.getElementById(fieldId(first.split(".")));
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
    el?.focus({ preventScroll: true });
  });
}

export function EntryForm({ collection, id, initial, updatedAt, sources, uploads }: Props) {
  const spec = specs[collection] as Spec;
  const router = useRouter();
  const [data, setData] = useState<Record<string, unknown>>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState<string>();
  const [inFlight, setInFlight] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pending, start] = useTransition();
  const saving = useRef(false);

  const saved = useMemo(() => JSON.stringify(initial), [initial]);
  const dirty = JSON.stringify(data) !== saved;
  const listHref = `/admin/${collection}/`;

  const set = useCallback((path: Path, value: unknown) => {
    setData((d) => setIn(d, path, value) as Record<string, unknown>);
  }, []);
  const uploading = useCallback((delta: 1 | -1) => setInFlight((n) => n + delta), []);
  const ctx = useMemo(() => ({ errors, sources, set, uploading, uploads }), [errors, sources, set, uploading, uploads]);

  // Warn before losing unsaved changes: closing the tab, or following a link inside the admin.
  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (!saving.current) e.preventDefault();
    };
    const click = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      if (!window.confirm("You have unsaved changes. Leave this page and discard them?")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", click, true);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", click, true);
    };
  }, [dirty]);

  const submit = (next: "list" | "new") => {
    const check = validate(spec.fields, data, sources);
    if (!check.ok) {
      setErrors(check.errors);
      setMessage("Some fields need attention.");
      focusFirstError(check.errors);
      return;
    }
    setErrors({});
    setMessage(undefined);
    saving.current = true;
    start(async () => {
      try {
        const result = await saveItem({ collection, id, data, updatedAt, next });
        if (result) {
          setErrors(result.errors);
          setMessage(result.message);
          focusFirstError(result.errors);
        }
      } finally {
        saving.current = false;
      }
    });
  };

  const remove = () =>
    start(async () => {
      const result = await deleteItem(collection, id!);
      if (result?.error) {
        setConfirmDelete(false);
        setMessage(result.error);
        return;
      }
      saving.current = true;
      router.push(listHref);
    });

  const busy = pending || inFlight > 0;

  return (
    <FormCtx.Provider value={ctx}>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          submit("list");
        }}
      >
        {message && (
          <p role="alert" className="mb-6 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-fg">
            {message}
          </p>
        )}

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-7">
          <Fields fields={spec.fields} value={data} path={[]} />
        </div>

        <div className="sticky bottom-0 z-30 -mx-4 mt-6 flex flex-wrap items-center gap-3 border-t border-line bg-bg/90 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-5">
          <button type="submit" disabled={busy} className="btn btn-primary">
            {pending ? "Saving…" : inFlight ? "Uploading…" : "Save"}
          </button>
          {spec.kind === "list" && (
            <button type="button" disabled={busy} className="btn btn-secondary" onClick={() => submit("new")}>
              Save and add another
            </button>
          )}
          <Link href={spec.kind === "list" ? listHref : "/admin/"} className="btn px-2 text-fg-2 hover:text-fg">
            Cancel
          </Link>
          <span className="text-[13px] text-muted" aria-live="polite">
            {dirty ? "Unsaved changes" : ""}
          </span>

          {id && spec.kind === "list" && (
            <span className="ml-auto flex items-center gap-2">
              {confirmDelete ? (
                <>
                  <span className="text-sm text-fg-2">Delete this {spec.singular}?</span>
                  <button type="button" disabled={pending} className="btn btn-danger" onClick={remove}>
                    Delete
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setConfirmDelete(false)}>
                    Keep
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn-danger" onClick={() => setConfirmDelete(true)}>
                  Delete
                </button>
              )}
            </span>
          )}
        </div>
      </form>
    </FormCtx.Provider>
  );
}
