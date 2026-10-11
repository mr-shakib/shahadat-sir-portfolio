/** Orderings, groupings and counts computed from the content. */
import type { ListSpec } from "./schema";
import type { Content, Institution, Lecture, Publication, Semester, SupervisedWork } from "./types";

const seasons: Record<string, number> = { Winter: 0, Spring: 1, Summer: 2, Fall: 3, Autumn: 3 };

/** Sort key for terms like "Fall 2024"; empty or unknown terms sort last. */
export function termKey(term?: string) {
  const m = term?.match(/^(\w+) (\d{4})$/);
  return m && m[1] in seasons ? Number(m[2]) * 10 + seasons[m[1]] : -1;
}

/**
 * Applies a collection's ordering. `items` must already be in position order, which breaks ties.
 * `parents` lists the parent collection's values in its order (e.g. course slugs), when the spec has a parent.
 * `fields` reads the content fields of an item (for rows that wrap them).
 */
export function orderList<T>(
  spec: Pick<ListSpec, "order" | "parent">,
  items: T[],
  parents: string[] = [],
  fields: (item: T) => object = (item) => item as object,
): T[] {
  const f = (item: T) => fields(item) as Record<string, unknown>;
  const rank = (item: T) => {
    if (!spec.parent) return 0;
    const i = parents.indexOf(String(f(item)[spec.parent.field]));
    return i === -1 ? parents.length : i;
  };
  const within = (a: T, b: T) =>
    spec.order === "year"
      ? Number(f(b).year) - Number(f(a).year)
      : spec.order === "term"
        ? termKey(f(b).term as string | undefined) - termKey(f(a).term as string | undefined)
        : 0;
  return spec.parent || spec.order !== "manual" ? [...items].sort((a, b) => rank(a) - rank(b) || within(a, b)) : items;
}

// ── Teaching ──────────────────────────────────────────────────────────

/** Universities with their semesters, newest first; universities with no semesters are left out. */
export function teachingHistory(c: Pick<Content, "institutions" | "semesters">) {
  return c.institutions
    .map((inst) => ({ ...inst, semesters: c.semesters.filter((s) => s.institution === inst.name) }))
    .filter((inst) => inst.semesters.length);
}

/** Course names without codes or lab suffixes, de-duplicated. */
export function subjectsTaught(semesters: Semester[]) {
  return Array.from(
    new Set(
      semesters.flatMap((s) =>
        s.courses.map((c) =>
          c
            .replace(/^[A-Z]+\d+\s+/, "")
            .replace(/\s+(Lab|Laboratory|Sessional)$/, "")
            .replace(/^Computer Network$/, "Computer Networks")
            .replace(/^Computer Simulation & Modeling$/, "Simulation and Modeling")
            .replace(
              /^Computer Fundamental(s)? (&|and) Programming (Techniques?|Language)$/,
              "Computer Fundamentals & Programming",
            )
            .replace(/^Operating System( Concepts)?$/, "Operating Systems")
            .replace(/^Object[- ]Oriented Programming( Language| II)$/, "Object-Oriented Programming"),
        ),
      ),
    ),
  ).sort();
}

export function teachingStats(c: Pick<Content, "institutions" | "semesters">) {
  return {
    semesters: c.semesters.length,
    offerings: c.semesters.reduce((n, s) => n + s.courses.length, 0),
    subjects: subjectsTaught(c.semesters).length,
    institutions: teachingHistory(c).length,
  };
}

/** Splits "CSE221 Object Oriented Programming II" into its code and title. */
export function splitCourse(course: string) {
  const m = course.match(/^([A-Z]+\d+)\s+(.*)$/);
  return { code: m?.[1] ?? "", title: m?.[2] ?? course };
}

// ── Supervision ───────────────────────────────────────────────────────

/** Supervised work grouped by university and semester, in display order. */
export function supervisionGroups<T extends SupervisedWork>(items: T[], institutions: Institution[]) {
  const groups: { institution: string; term?: string; period?: string; items: T[] }[] = [];
  for (const item of items) {
    const last = groups.at(-1);
    if (last && last.institution === item.institution && last.term === item.term) last.items.push(item);
    else
      groups.push({
        institution: item.institution,
        term: item.term,
        period: institutions.find((i) => i.name === item.institution)?.period,
        items: [item],
      });
  }
  return groups;
}

export function supervisionStats(items: SupervisedWork[]) {
  return {
    total: items.length,
    theses: items.filter((i) => i.kind === "Thesis").length,
    projects: items.filter((i) => i.kind === "Project").length,
    published: items.filter((i) => i.outcome).length,
  };
}

// ── Publications ──────────────────────────────────────────────────────

export function publicationStats(publications: Publication[], selfNames: string[]) {
  const by = (t: Publication["type"]) => publications.filter((p) => p.type === t).length;
  return {
    total: publications.length,
    journal: by("journal"),
    chapter: by("chapter"),
    conference: by("conference"),
    firstAuthor: publications.filter((p) => selfNames.includes(p.authors[0])).length,
  };
}

/** "Springer, IEEE and ACM" */
export function joinAnd(items: string[]) {
  return items.length < 2 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

const words = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
/** "Four" for 4, "12" for 12. */
export const countWord = (n: number) => words[n] ?? String(n);

/** First year of university teaching, from the earliest academic appointment. */
export function teachingSince(c: Pick<Content, "positions">) {
  const years = c.positions.filter((p) => p.academic).map((p) => Number(p.start.slice(-4)));
  return years.length ? Math.min(...years) : new Date().getFullYear();
}

// ── Lectures ──────────────────────────────────────────────────────────

/** A course's lectures, in order. */
export const courseLectures = <T extends Lecture>(lectures: T[], course: string) =>
  lectures.filter((l) => l.course === course);

/** The first paragraph of a lecture's notes as plain text, for previews. */
export function excerpt(markdown: string | undefined, length = 160) {
  const para = (markdown ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .find((p) => p && !/^(#|!\[|```|- |\d+\. |\|)/.test(p));
  if (!para) return "";
  const text = para
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]|\\(?=\S)/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > length ? `${text.slice(0, length).replace(/\s+\S*$/, "")}…` : text;
}
