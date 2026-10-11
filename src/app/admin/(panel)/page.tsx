import type { Metadata } from "next";
import Link from "next/link";
import { LuBookOpen, LuFileText, LuGraduationCap, LuMegaphone, LuPlus, LuPresentation } from "react-icons/lu";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { groups, specs } from "@/content/schema";
import { collectionStats } from "@/content/store";
import type { ListKey } from "@/content/types";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Overview" };

const quick: { key: ListKey; icon: typeof LuPlus; label: string }[] = [
  { key: "semesters", icon: LuPresentation, label: "Add a semester’s courses" },
  { key: "supervision", icon: LuGraduationCap, label: "Add a thesis or project" },
  { key: "lectures", icon: LuBookOpen, label: "Add a lecture" },
  { key: "publications", icon: LuFileText, label: "Add a publication" },
  { key: "news", icon: LuMegaphone, label: "Add a news item" },
];

function ago(date: Date) {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const s = (date.getTime() - Date.now()) / 1000;
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of units) if (Math.abs(s) >= size) return rtf.format(Math.round(s / size), unit);
  return "just now";
}

export default async function AdminHome() {
  await requireAdmin();
  const stats = await collectionStats();

  return (
    <>
      <AdminHeader
        title="Overview"
        description="Everything on the site, by section. Changes go live as soon as you save."
      />

      <section aria-labelledby="quick">
        <h2 id="quick" className="text-[13px] font-semibold text-fg">
          Quick add
        </h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quick.map(({ key, icon: Icon, label }) => (
            <li key={key}>
              <Link
                href={`/admin/${key}/new/`}
                className="group flex items-center gap-3 rounded-xl border border-line bg-surface p-4 transition hover:border-primary/40 hover:shadow-card"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-on-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="text-[14.5px] font-medium text-fg">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {groups.map((g) => (
          <section key={g.label} aria-labelledby={`g-${g.label}`}>
            <h2 id={`g-${g.label}`} className="border-t border-fg/80 pt-3 text-[13px] font-semibold text-fg">
              {g.label}
            </h2>
            <ul className="mt-2 divide-y divide-line">
              {g.keys.map((key) => {
                const spec = specs[key];
                const s = stats[key];
                return (
                  <li key={key}>
                    <Link href={`/admin/${key}/`} className="group flex items-baseline justify-between gap-4 py-3">
                      <span className="min-w-0">
                        <span className="block font-medium text-fg group-hover:text-primary">{spec.label}</span>
                        <span className="block text-[13px] text-muted">
                          {s ? `Edited ${ago(s.updated)}` : "Nothing yet"}
                        </span>
                      </span>
                      {spec.kind === "list" && (
                        <span className="shrink-0 text-sm text-muted tabular-nums">{s?.count ?? 0}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
