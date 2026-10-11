import type { Publication } from "@/content/types";

const lastName = (name: string) => name.trim().split(/\s+/).pop() ?? name;

const initials = (name: string) => {
  const parts = name.replace(/\./g, ". ").trim().split(/\s+/);
  const last = parts.pop() ?? "";
  const ini = parts
    .filter((p) => !/^Dr\.?$/i.test(p))
    .map((p) => `${p[0].toUpperCase()}.`)
    .join(" ");
  return ini ? `${last}, ${ini}` : last;
};

export const pubLink = (p: Publication) => (p.doi ? `https://doi.org/${p.doi}` : p.url);

/** APA-style reference string. */
export function toApa(p: Publication) {
  const names = p.authors.map(initials);
  const authors = names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")}, & ${names[names.length - 1]}`;
  const where = [p.venue, p.series, p.pages ? `pp. ${p.pages}` : "", p.publisher].filter(Boolean).join(", ");
  const link = pubLink(p);
  return `${authors} (${p.year}). ${p.title}. ${where}.${link ? ` ${link}` : ""}`;
}

/** BibTeX entry. */
export function toBibtex(p: Publication) {
  const key = `${lastName(p.authors[0])
    .toLowerCase()
    .replace(/[^a-z]/g, "")}${p.year}${
    p.title
      .split(/\s+/)
      .find((w) => w.length > 3 && !/^(the|and|for|with|from|using|some)$/i.test(w))
      ?.toLowerCase()
      .replace(/[^a-z]/g, "") ?? ""
  }`;
  const kind = p.type === "journal" ? "article" : p.type === "chapter" ? "incollection" : "inproceedings";
  const container = p.type === "journal" ? "journal" : "booktitle";
  const fields: [string, string | undefined][] = [
    ["title", `{${p.title}}`],
    ["author", p.authors.join(" and ")],
    [container, p.venue],
    ["series", p.type === "journal" ? undefined : p.series],
    ["note", p.type === "journal" ? p.series : undefined],
    ["pages", p.pages?.replace("–", "--")],
    ["publisher", p.publisher],
    ["year", String(p.year)],
    ["doi", p.doi],
    ["url", !p.doi ? p.url : undefined],
  ];
  const body = fields
    .filter(([, v]) => v)
    .map(([k, v]) => `  ${k.padEnd(9)} = {${v}}`)
    .join(",\n");
  return `@${kind}{${key},\n${body}\n}`;
}
