import type { Metadata } from "next";
import Link from "next/link";
import { LuArrowRight, LuArrowUpRight, LuPlay } from "react-icons/lu";
import { PageHeader, StatRow } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { TeachingHistory } from "@/components/TeachingHistory";
import {
  countWord,
  courseLectures,
  subjectsTaught,
  teachingHistory,
  teachingSince,
  teachingStats,
} from "@/content/derive";
import { getContent } from "@/content/store";

export const metadata: Metadata = {
  title: "Teaching",
  description:
    "Teaching philosophy, course materials and complete teaching history of Shahadat Hossain across Daffodil International University, City University and the University of South Asia.",
};

export default async function TeachingPage() {
  const content = await getContent();
  const { philosophy, courses: courseMaterials, semesters, socials } = content;
  const stats = teachingStats(content);
  const subjects = subjectsTaught(semesters);
  const youtube = socials.find((s) => s.key === "youtube");

  return (
    <>
      <PageHeader
        title="Teaching"
        description={`Since ${teachingSince(content)} I have taught undergraduate Computer Science and Engineering at ${
          stats.institutions === 1 ? "one university" : `${countWord(stats.institutions).toLowerCase()} universities`
        }, from programming and algorithms to data science, networks and software engineering.`}
      >
        <StatRow
          stats={[
            { value: stats.semesters, label: "Semesters taught" },
            { value: stats.offerings, label: "Course sections" },
            { value: stats.subjects, label: "Distinct subjects" },
            { value: stats.institutions, label: "Universities" },
          ]}
        />
      </PageHeader>

      {/* Philosophy */}
      <section className="container-page py-20" aria-labelledby="phil">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2
              id="phil"
              className="font-serif text-[1.9rem] leading-tight font-medium tracking-[-0.01em] text-fg sm:text-[2.2rem]"
            >
              Teaching philosophy
            </h2>
            <p className="mt-2 font-serif text-xl leading-snug text-fg-2">{philosophy.title}</p>
            <p className="mt-5 text-[1.05rem] leading-[1.8] text-fg-2">{philosophy.intro}</p>
            <p className="mt-5 border-l-2 border-gold-bright pl-5 font-serif text-lg leading-relaxed text-fg italic">
              {philosophy.closing}
            </p>
          </Reveal>
          <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {philosophy.principles.map((p, i) => (
              <Reveal
                as="li"
                key={p.title}
                delay={i * 60}
                className={`card p-6 ${i === philosophy.principles.length - 1 ? "sm:col-span-2" : ""}`}
              >
                <span className="font-serif text-3xl font-light text-gold">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-lg font-semibold text-fg">{p.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-fg-2">{p.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Course materials */}
      <section className="border-y border-line bg-surface/50" aria-labelledby="materials">
        <div className="container-page py-20">
          <Reveal>
            <SectionHeading
              id="materials"
              title="Course materials"
              description="Lecture notes, worked examples and slides I have published for students."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {courseMaterials.map((c, i) => {
              const lectures = courseLectures(content.lectures, c.slug);
              return (
                <Reveal key={c.id} delay={i * 60}>
                  <article className="card flex h-full flex-col p-6">
                    <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                      {lectures.length} lecture{lectures.length === 1 ? "" : "s"}
                    </p>
                    <h3 className="mt-1.5 font-serif text-xl leading-snug font-medium text-fg">
                      <Link href={`/teaching/${c.slug}/`} className="transition hover:text-primary">
                        {c.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-fg-2">{c.summary}</p>
                    <ol className="mt-5 space-y-0.5 border-t border-line pt-3">
                      {lectures.slice(0, 4).map((l, j) => (
                        <li key={l.id}>
                          <Link
                            href={`/teaching/${c.slug}/${l.slug}/`}
                            className="flex items-baseline gap-3 rounded-lg px-2 py-1.5 text-[14px] text-fg-2 transition hover:bg-surface-2 hover:text-primary"
                          >
                            <span className="w-5 shrink-0 font-mono text-[11.5px] text-muted tabular-nums">
                              {String(j + 1).padStart(2, "0")}
                            </span>
                            <span>{l.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ol>
                    <Link
                      href={`/teaching/${c.slug}/`}
                      className="group mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primary"
                    >
                      {lectures.length > 4 ? `All ${lectures.length} lectures` : "Open course"}
                      <LuArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  </article>
                </Reveal>
              );
            })}
            {youtube && (
              <Reveal delay={courseMaterials.length * 60}>
                <a
                  href={youtube.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-ink p-6 text-on-ink shadow-card-lg"
                >
                  <div
                    className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-[#e62117]/30 blur-2xl"
                    aria-hidden
                  />
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#e62117] text-white">
                    <LuPlay className="size-5 translate-x-px fill-current" aria-hidden />
                  </span>
                  <span className="mt-8 block">
                    <span className="text-xs font-semibold tracking-[0.14em] text-on-ink-muted uppercase">
                      Video lectures
                    </span>
                    <span className="mt-1.5 block font-serif text-2xl font-medium">
                      {youtube.label.replace(/^YouTube:\s*/, "")}
                    </span>
                    <span className="mt-1 flex items-center gap-1 text-sm text-on-ink-muted">
                      {youtube.handle
                        ? `youtube.com/${youtube.handle}`
                        : youtube.href.replace(/^https?:\/\/(www\.)?/, "")}
                      <LuArrowUpRight
                        className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  </span>
                </a>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* Teaching history */}
      <section className="container-page py-20" aria-labelledby="history">
        <Reveal>
          <SectionHeading
            id="history"
            title="Courses taught"
            description="Every course I have taught, by university and semester."
          />
        </Reveal>
        <div className="mt-10">
          <TeachingHistory history={teachingHistory(content)} />
        </div>
      </section>

      {/* Subjects */}
      <section className="container-page" aria-labelledby="subjects">
        <Reveal className="card p-7 sm:p-9">
          <h2 id="subjects" className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
            Subjects taught · {subjects.length}
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {subjects.map((s) => (
              <li key={s} className="rounded-full border border-line bg-bg px-3 py-1.5 text-[13.5px] text-fg-2">
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </>
  );
}
