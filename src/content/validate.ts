import { sourceKey, type Field, type Option, type Options } from "./schema";
import { slugify } from "./slug";

/** Allowed values for options that come from another collection, keyed by `sourceKey`. */
export type SourceOptions = Record<string, Option[]>;
/** Error messages keyed by field path, e.g. "office.room" or "lectures.2.href". */
export type Errors = Record<string, string>;

export function optionList(options: Options, sources: SourceOptions): readonly Option[] {
  return Array.isArray(options) ? options : (sources[sourceKey(options as { from: string; value: string })] ?? []);
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

const isHttpUrl = (s: string) => {
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
};
/** A path on this site, but not a protocol-relative URL like //example.com. */
const isSitePath = (s: string) => /^\/(?!\/)/.test(s);

const str = (v: unknown) => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");

/**
 * Checks `input` against `fields` and returns the cleaned record: strings trimmed, empty optional
 * values dropped, lists always present. Anything not described by a field is discarded.
 */
export function validate(fields: readonly Field[], input: unknown, sources: SourceOptions) {
  const errors: Errors = {};
  const data = record(fields, input, "", sources, errors);
  return { data, errors, ok: Object.keys(errors).length === 0 };
}

function record(
  fields: readonly Field[],
  input: unknown,
  path: string,
  sources: SourceOptions,
  errors: Errors,
): Record<string, unknown> {
  const src = isRecord(input) ? input : {};
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const value = field(f, src[f.name], path ? `${path}.${f.name}` : f.name, sources, errors);
    if (value !== undefined) out[f.name] = value;
  }
  for (const f of fields) {
    if (f.type === "text" && f.slugOf && out[f.name] === undefined && typeof out[f.slugOf] === "string") {
      const slug = slugify(out[f.slugOf] as string);
      if (slug) out[f.name] = slug;
    }
  }
  return out;
}

function field(f: Field, raw: unknown, path: string, sources: SourceOptions, errors: Errors): unknown {
  const fail = (message: string) => {
    errors[path] = message;
    return undefined;
  };

  switch (f.type) {
    case "text":
    case "textarea": {
      const s = str(raw);
      if (!s) return f.required ? fail("Required") : undefined;
      if (s.length > (f.type === "text" ? 600 : 12000)) return fail("Too long");
      if (f.type === "textarea") return s;
      if (f.input === "url" && !isHttpUrl(s)) return fail("Enter a full link starting with https://");
      if (f.input === "link" && !isHttpUrl(s) && !isSitePath(s))
        return fail("Enter a full link, or a page on this site starting with /");
      if (f.input === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return fail("Enter a valid email address");
      if (f.pattern && !new RegExp(f.pattern).test(s)) return fail(f.patternHint ?? "Invalid format");
      return s;
    }
    case "markdown": {
      const s = typeof raw === "string" ? raw.replace(/\r\n?/g, "\n").replace(/\s+$/, "") : "";
      if (!s.trim()) return f.required ? fail("Required") : undefined;
      if (s.length > 200000) return fail("Too long");
      return s;
    }
    case "number": {
      const s = str(raw);
      if (!s) return f.required ? fail("Required") : undefined;
      const n = Number(s);
      if (!Number.isInteger(n)) return fail("Enter a whole number");
      if ((f.min !== undefined && n < f.min) || (f.max !== undefined && n > f.max))
        return fail(`Enter a number from ${f.min} to ${f.max}`);
      return n;
    }
    case "checkbox":
      return raw === true || raw === "on" || raw === "true" ? true : undefined;
    case "select": {
      const s = str(raw);
      if (!s) return f.required ? fail("Required") : undefined;
      if (!optionList(f.options, sources).some((o) => o.value === s)) return fail("Choose one of the options");
      return s;
    }
    case "multiselect": {
      const values = [...new Set((Array.isArray(raw) ? raw : []).map(str).filter(Boolean))];
      const allowed = new Set(optionList(f.options, sources).map((o) => o.value));
      if (values.some((v) => !allowed.has(v))) return fail("Choose from the listed options");
      if (!values.length && f.required) return fail("Choose at least one");
      return values;
    }
    case "strings": {
      const items = (Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split("\n") : [])
        .map(str)
        .filter(Boolean);
      if (!items.length && f.required) return fail("Add at least one");
      if (items.some((s) => s.length > 12000)) return fail("An item is too long");
      return items;
    }
    case "list": {
      const items = Array.isArray(raw) ? raw : [];
      if (!items.length && f.required) return fail(`Add at least one ${f.itemLabel.toLowerCase()}`);
      return items.map((item, i) => record(f.fields, item, `${path}.${i}`, sources, errors));
    }
    case "group":
      return record(f.fields, raw, path, sources, errors);
    case "image":
    case "file": {
      const s = str(raw);
      if (!s) return f.required ? fail(f.type === "image" ? "Add a photo" : "Add a file") : undefined;
      if (!isSitePath(s) && !isHttpUrl(s)) return fail("Upload a file or enter a link");
      return s;
    }
    case "images": {
      const items = (Array.isArray(raw) ? raw : []).map(str).filter(Boolean);
      if (items.some((s) => !isSitePath(s) && !isHttpUrl(s))) return fail("Each photo must be an upload or a link");
      if (!items.length && f.required) return fail("Add at least one photo");
      return items;
    }
  }
}
