import type { Content } from "@/content/types";
import { termKey } from "@/content/derive";

/** Publications per calendar year, including empty years. */
export function publicationsByYear({ publications }: Pick<Content, "publications">) {
  if (!publications.length) return [];
  const years = publications.map((p) => p.year);
  const out: { label: string; value: number }[] = [];
  for (let y = Math.min(...years); y <= Math.max(...years); y++) {
    out.push({ label: String(y), value: publications.filter((p) => p.year === y).length });
  }
  return out;
}

/** Course sections per semester, oldest first, tagged with the institution. */
export function sectionsBySemester({ semesters, institutions }: Pick<Content, "semesters" | "institutions">) {
  const short = (name: string) => institutions.find((i) => i.name === name)?.short ?? name;
  return [...semesters]
    .sort((a, b) => termKey(a.term) - termKey(b.term))
    .map((s) => ({ label: s.term, value: s.courses.length, group: short(s.institution) }));
}

/** Supervised works per research area, largest first; the long tail folds into "Other". */
export function supervisionByArea({ supervision }: Pick<Content, "supervision">, keep = 4) {
  const counts = new Map<string, number>();
  for (const item of supervision) counts.set(item.domain, (counts.get(item.domain) ?? 0) + 1);
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const head = sorted.slice(0, keep).map(([label, value]) => ({ label, value }));
  const rest = sorted.slice(keep).reduce((n, [, v]) => n + v, 0);
  return rest ? [...head, { label: "Other", value: rest }] : head;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toYear(s: string, now: Date) {
  if (s === "Present") return now.getFullYear() + now.getMonth() / 12;
  const [m, y] = s.split(" ");
  return Number(y) + Math.max(0, MONTHS.indexOf(m)) / 12;
}

/** Academic appointments as segments on a continuous time axis, oldest first. */
export function careerSegments(
  { positions, institutions }: Pick<Content, "positions" | "institutions">,
  now = new Date(),
) {
  return positions
    .filter((p) => p.academic)
    .map((p) => ({
      role: p.role,
      org: institutions.find((i) => i.name === p.org)?.short ?? p.org,
      period: `${p.start} – ${p.end}`,
      start: toYear(p.start, now),
      end: toYear(p.end, now),
      current: Boolean(p.current),
    }))
    .sort((a, b) => a.start - b.start);
}
