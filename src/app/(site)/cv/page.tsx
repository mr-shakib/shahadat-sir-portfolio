import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LuAward, LuBadgeCheck, LuBriefcase, LuDownload, LuGraduationCap } from "react-icons/lu";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { getContent } from "@/content/store";

export const metadata: Metadata = {
  title: "Curriculum Vitae",
  description: "Academic CV of Shahadat Hossain: appointments, education, awards, service, certifications and skills.",
};

const sections = [
  { id: "appointments", label: "Appointments" },
  { id: "education", label: "Education" },
  { id: "awards", label: "Awards and honors" },
  { id: "service", label: "Service and peer review" },
  { id: "certifications", label: "Certifications" },
  { id: "skills", label: "Skills" },
  { id: "development", label: "Professional development" },
];

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <Reveal as="section" className="border-t border-line pt-10 first:border-t-0 first:pt-0">
      <h2 id={id} className="font-serif text-[1.75rem] leading-tight font-medium tracking-[-0.01em] text-fg">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </Reveal>
  );
}

export default async function CvPage() {
  const { profile, positions, education, awards, certifications, service, skills, cvLists } = await getContent();
  const { reviewing, development: professionalDevelopment, interests } = cvLists;
  const academic = positions.filter((p) => p.academic);
  const other = positions.filter((p) => !p.academic);

  return (
    <>
      <PageHeader
        title="Curriculum vitae"
        description={`${profile.title}, ${profile.department}, ${profile.university}.`}
      >
        <a
          href={profile.cv}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary shadow-card transition hover:-translate-y-0.5 hover:bg-primary-hover"
        >
          <LuDownload className="size-4" aria-hidden /> Download full CV (PDF)
        </a>
      </PageHeader>

      <div className="container-page grid gap-12 py-16 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="CV sections" className="no-print hidden lg:block">
          <ul className="sticky top-24 space-y-1 border-l border-line">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-muted transition hover:border-gold-bright hover:text-fg"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 space-y-12">
          <Block id="appointments" title="Academic appointments">
            <ol className="relative space-y-0 border-l border-line">
              {academic.map((p) => (
                <li key={p.id} className="relative pb-8 pl-8 last:pb-0">
                  <span
                    className={`absolute top-1 -left-[9px] inline-flex size-[17px] items-center justify-center rounded-full ring-4 ring-bg ${
                      p.current ? "bg-primary" : "border border-line-strong bg-surface"
                    }`}
                    aria-hidden
                  >
                    {p.current && <span className="size-1.5 rounded-full bg-on-primary" />}
                  </span>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <h3 className="text-lg font-semibold text-fg">{p.role}</h3>
                    <p className="shrink-0 text-sm text-muted tabular-nums">
                      {p.start} – {p.end}
                    </p>
                  </div>
                  <p className="text-fg-2">{[p.dept, p.org].filter(Boolean).join(", ")}</p>
                  {p.current && (
                    <span className="mt-2 inline-block rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
                      Current position
                    </span>
                  )}
                </li>
              ))}
            </ol>

            <h3 className="mt-12 text-xs font-semibold tracking-[0.14em] text-muted uppercase">Earlier experience</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {other.map((p) => (
                <li key={p.id} className="card p-5">
                  <LuBriefcase className="size-4 text-gold" aria-hidden />
                  <p className="mt-3 leading-snug font-semibold text-fg">{p.role}</p>
                  <p className="mt-1 text-sm text-fg-2">{p.org}</p>
                  <p className="mt-1 text-xs text-muted">
                    {p.start} – {p.end}
                  </p>
                </li>
              ))}
            </ul>
          </Block>

          <Block id="education" title="Education">
            <ol className="space-y-4">
              {education.map((e) => (
                <li key={e.id} className="card flex gap-5 p-6">
                  <span className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary sm:inline-flex">
                    <LuGraduationCap className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                      <h3 className="text-lg leading-snug font-semibold text-fg">
                        {e.degree}
                        {e.field && <span className="font-normal text-fg-2">, {e.field}</span>}
                      </h3>
                      <p className="shrink-0 text-sm text-muted">{e.year}</p>
                    </div>
                    <p className="mt-0.5 text-fg-2">{e.institution}</p>
                    {(e.thesis || e.supervisor || e.result) && (
                      <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-[14px] sm:grid-cols-[110px_minmax(0,1fr)]">
                        {e.thesis && (
                          <>
                            <dt className="text-muted">Thesis</dt>
                            <dd className="text-fg-2 italic">“{e.thesis}”</dd>
                          </>
                        )}
                        {e.supervisor && (
                          <>
                            <dt className="text-muted">Supervisor</dt>
                            <dd className="text-fg-2">{e.supervisor}</dd>
                          </>
                        )}
                        {e.result && (
                          <>
                            <dt className="text-muted">Result</dt>
                            <dd className="text-fg-2">
                              {e.result}
                              {e.honor && (
                                <span className="ml-2 rounded-full bg-gold-soft px-2 py-0.5 text-xs font-semibold text-gold">
                                  {e.honor}
                                </span>
                              )}
                            </dd>
                          </>
                        )}
                      </dl>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </Block>

          <Block id="awards" title="Awards and honors">
            <ul className="grid gap-4 sm:grid-cols-3">
              {awards.map((a) => (
                <li key={a.id} className="card flex flex-col p-6">
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-gold-soft text-gold">
                    <LuAward className="size-5" aria-hidden />
                  </span>
                  <p className="mt-4 leading-snug font-semibold text-fg">{a.title}</p>
                  <p className="mt-1 text-sm text-fg-2">{a.by}</p>
                  <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-muted">{a.detail}</p>
                  {a.year && <p className="mt-3 text-xs font-semibold text-gold">{a.year}</p>}
                </li>
              ))}
            </ul>
          </Block>

          <Block id="service" title="Service and peer review">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">Departmental roles</h3>
                <ul className="mt-4 divide-y divide-line border-y border-line">
                  {service.map((s) => (
                    <li key={s.id} className="py-3">
                      <p className="font-semibold text-fg">{s.role}</p>
                      <p className="text-sm text-fg-2">{s.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">Peer review</h3>
                <ul className="mt-4 divide-y divide-line border-y border-line">
                  {reviewing.map((r) => (
                    <li key={r} className="py-3">
                      <p className="font-semibold text-fg">Reviewer</p>
                      <p className="text-sm text-fg-2">{r}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Block>

          <Block id="certifications" title="Certifications">
            <ul className="grid gap-3 sm:grid-cols-2">
              {certifications.map((c) => (
                <li key={c.id} className="flex gap-3 rounded-xl border border-line bg-surface p-4">
                  <LuBadgeCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="leading-snug font-medium text-fg">{c.title}</p>
                    <p className="mt-0.5 text-sm text-muted">
                      {c.by}
                      {c.year && ` · ${c.year}`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Block>

          <Block id="skills" title="Skills">
            <div className="grid gap-4 sm:grid-cols-2">
              {skills.map((g) => (
                <div key={g.id} className="card p-5">
                  <h3 className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">{g.group}</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {g.items.map((s) => (
                      <li key={s} className="rounded-full bg-surface-2 px-3 py-1 text-[13.5px] text-fg-2">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted">
              <span className="font-semibold text-fg-2">Interests:</span> {interests.join(" · ")}
            </p>
          </Block>

          <Block id="development" title="Professional development">
            <ul className="space-y-2.5">
              {professionalDevelopment.map((d) => (
                <li key={d} className="flex gap-3 text-fg-2">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold-bright" aria-hidden />
                  {d}
                </li>
              ))}
            </ul>
          </Block>
        </div>
      </div>
    </>
  );
}
