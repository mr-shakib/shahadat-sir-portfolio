import type { Metadata } from "next";
import Link from "next/link";
import { LuArrowRight, LuArrowUpRight, LuGraduationCap, LuMicroscope } from "react-icons/lu";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ThemeIcon } from "@/components/ThemeIcon";
import { countWord } from "@/content/derive";
import { getContent } from "@/content/store";
import type { Publication } from "@/content/types";
import { pubLink } from "@/lib/cite";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Research themes of Shahadat Hossain: human behavior analysis, data science and visualization, machine learning, and secure information systems.",
};

// Merge spelling variants of the same co-author (e.g. "Md Manzurul Hasan", "M. M. Hasan").
const aliases: Record<string, string> = {
  "md manzurul hasan": "Md. Manzurul Hasan",
  "m m hasan": "Md. Manzurul Hasan",
  "md mahmudur rahman": "Md. Mahmudur Rahman",
  "tanzila mehenaz": "Tanzila Mehnaz",
  "d gomes": "Dipta Gomes",
};
const canonical = (name: string) => {
  const key = name
    .toLowerCase()
    .replace(/\./g, " ")
    .replace(/^dr\s+/, "")
    .replace(/\s+/g, " ")
    .trim();
  return aliases[key] ?? name;
};

function topCollaborators(publications: Publication[], selfNames: string[], limit = 8) {
  const counts = new Map<string, number>();
  for (const p of publications) {
    for (const a of new Set(p.authors.filter((x) => !selfNames.includes(x)).map(canonical))) {
      counts.set(a, (counts.get(a) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, n]) => n > 1)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit);
}

export default async function ResearchPage() {
  const { profile, publications, themes, research } = await getContent();
  const collaborators = topCollaborators(publications, profile.authorNames);

  return (
    <>
      <PageHeader
        title="Research"
        description="I study how people behave on digital platforms, combining machine learning, behavior analysis and information visualization to explain what drives their decisions."
      />

      {/* Current research */}
      <section className="container-page pt-16">
        <Reveal className="card grid gap-8 overflow-hidden p-0 md:grid-cols-[minmax(0,1fr)_340px]">
          <div className="p-7 sm:p-9">
            <h2 className="flex items-center gap-3 font-serif text-2xl font-medium tracking-[-0.01em] sm:text-[1.75rem]">
              <LuMicroscope className="size-5 text-primary" aria-hidden /> Doctoral research
            </h2>
            <p className="mt-4 leading-relaxed text-fg-2">
              I am pursuing a PhD in Computer Science and Engineering at {profile.phd.institution}, supervised by{" "}
              {profile.phd.supervisor}, alongside my faculty role at {profile.university}.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-5 border-t border-line bg-surface-2 p-7 sm:p-9 md:border-t-0 md:border-l">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-on-primary">
                <LuGraduationCap className="size-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-fg">{profile.phd.institution}</p>
                <p className="text-sm text-muted">PhD in CSE · ongoing</p>
              </div>
            </div>
            <div className="text-sm">
              <p className="text-muted">Supervisor</p>
              <p className="font-medium text-fg">{profile.phd.supervisor}</p>
              {profile.phd.supervisorRole && <p className="text-muted">{profile.phd.supervisorRole}</p>}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Themes */}
      <section className="container-page py-20" aria-labelledby="themes-h">
        <Reveal>
          <SectionHeading
            id="themes-h"
            title="Research areas"
            description={`${countWord(themes.length)} connected areas, each with its related publications.`}
          />
        </Reveal>

        <div className="mt-12 space-y-8">
          {themes.map((t, i) => {
            const related = publications.filter((p) => p.themes.includes(t.key));
            return (
              <Reveal key={t.key}>
                <article id={t.key} className="card grid gap-0 overflow-hidden lg:grid-cols-12">
                  <div className="p-7 sm:p-9 lg:col-span-7">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                        <ThemeIcon icon={t.icon} className="size-6" />
                      </span>
                      <span className="font-serif text-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="mt-5 font-serif text-2xl font-medium tracking-tight sm:text-[1.75rem]">{t.title}</h3>
                    <p className="mt-4 leading-relaxed text-fg-2">{t.summary}</p>
                    <h4 className="mt-6 text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                      Guiding questions
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {t.questions.map((q) => (
                        <li key={q} className="flex gap-3 text-[15px] leading-relaxed text-fg-2">
                          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold-bright" aria-hidden />
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-line bg-surface-2/60 p-7 sm:p-9 lg:col-span-5 lg:border-t-0 lg:border-l">
                    <h4 className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                      Related publications · {related.length}
                    </h4>
                    <ul className="mt-4 space-y-3.5">
                      {related.slice(0, 5).map((p) => {
                        const href = pubLink(p);
                        return (
                          <li key={p.id} className="text-[14.5px] leading-snug">
                            {href ? (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group font-medium text-fg transition hover:text-primary"
                              >
                                {p.title}
                                <LuArrowUpRight
                                  className="ml-1 inline size-3.5 align-[-2px] text-muted group-hover:text-primary"
                                  aria-hidden
                                />
                              </a>
                            ) : (
                              <span className="font-medium text-fg">{p.title}</span>
                            )}
                            <span className="mt-0.5 block text-[13px] text-muted">
                              {p.publisher ?? p.venue} · {p.year}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    {related.length > 5 && (
                      <Link
                        href="/publications/"
                        className="group mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary"
                      >
                        {related.length - 5} more
                        <LuArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
                      </Link>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Methods & collaborators */}
      <section className="border-y border-line bg-surface/50">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-2">
          <Reveal>
            <SectionHeading title="Methods and techniques" />
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {research.methods.map((m) => (
                <li
                  key={m}
                  className="rounded-full border border-line bg-surface px-3.5 py-2 text-[14px] font-medium text-fg-2 shadow-card"
                >
                  {m}
                </li>
              ))}
            </ul>
            <h3 className="mt-10 text-xs font-semibold tracking-[0.14em] text-muted uppercase">Published with</h3>
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
              {research.publishers.map((p) => (
                <li key={p} className="font-serif text-xl text-fg-2">
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <SectionHeading
              title="Frequent co-authors"
              description="Researchers I have published with more than once."
            />
            <ul className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
              {collaborators.map(([name, n]) => (
                <li key={name} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <span className="flex items-center gap-3">
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary-soft text-[12px] font-semibold text-primary">
                      {name
                        .replace(/^Md\.?\s+/, "")
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <span className="font-medium text-fg">{name}</span>
                  </span>
                  <span className="text-sm text-muted tabular-nums">
                    {n} paper{n === 1 ? "" : "s"}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
