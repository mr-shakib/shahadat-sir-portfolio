import Link from "next/link";
import { LuArrowRight, LuArrowUpRight, LuBookMarked, LuGraduationCap, LuMail, LuPlay, LuQuote } from "react-icons/lu";
import { GlanceRow } from "@/components/hero/GlanceRow";
import { Hero } from "@/components/hero/Hero";
import { PublicationItem } from "@/components/PublicationItem";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ThemeIcon } from "@/components/ThemeIcon";
import { countWord } from "@/content/derive";
import { siteUrl } from "@/content/site";
import { getContent } from "@/content/store";
import { careerSegments, publicationsByYear, sectionsBySemester, supervisionByArea } from "@/lib/glance";

const newsTone: Record<string, string> = {
  Publication: "bg-primary-soft text-primary",
  Career: "bg-gold-soft text-gold",
  Award: "bg-gold-soft text-gold",
  Education: "bg-surface-2 text-fg-2",
  Book: "bg-primary-soft text-primary",
  Talk: "bg-primary-soft text-primary",
  Event: "bg-surface-2 text-fg-2",
};

export default async function HomePage() {
  const content = await getContent();
  const { profile, socials, news, book, publications, themes, research, education, philosophy } = content;
  const featured = publications.filter((p) => p.featured);
  const youtube = socials.find((s) => s.key === "youtube");
  const career = careerSegments(content);
  const now = new Date();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    email: `mailto:${profile.email}`,
    image: `${siteUrl}${profile.photo}`,
    url: siteUrl,
    worksFor: {
      "@type": "CollegeOrUniversity",
      name: profile.university,
      url: profile.universityUrl,
      department: profile.department,
    },
    alumniOf: [
      ...new Set(education.filter((e) => /bachelor|master|doctor|phd/i.test(e.degree)).map((e) => e.institution)),
    ].map((name) => ({ "@type": "CollegeOrUniversity", name })),
    knowsAbout: research.interests,
    sameAs: socials.map((s) => s.href),
  };

  return (
    <>
      {/* "<" is escaped so edited text can never close the script tag. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <Hero content={content} />

      {/* ── At a glance ─────────────────────────────────────── */}
      <section className="container-page pt-16 pb-14 lg:pt-20 lg:pb-16" aria-labelledby="glance">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-fg/80 pt-3">
            <h2 id="glance" className="text-[13px] font-semibold text-fg">
              At a glance
            </h2>
            <p className="text-[12px] text-muted">Computed from the publication, teaching and supervision records</p>
          </div>
          <div className="mt-6">
            <GlanceRow
              publications={publicationsByYear(content)}
              sections={sectionsBySemester(content)}
              supervision={supervisionByArea(content)}
              career={career}
              axisStart={Math.floor(career[0]?.start ?? now.getFullYear())}
              axisEnd={now.getFullYear() + now.getMonth() / 12}
            />
          </div>
        </Reveal>
      </section>

      {/* ── Biography ───────────────────────────────────────── */}
      <section className="border-t border-line bg-surface/50" aria-labelledby="bio">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <h2
              id="bio"
              className="font-serif text-[1.9rem] leading-tight font-medium tracking-[-0.01em] text-fg sm:text-[2.2rem]"
            >
              Biography
            </h2>
            <div className="prose-academic mt-6 text-[1.05rem] leading-[1.8] text-fg-2">
              {profile.bio.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
              <Link href="/research/" className="group inline-flex items-center gap-1 text-primary">
                Research agenda <LuArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <Link href="/cv/" className="group inline-flex items-center gap-1 text-primary">
                Full CV <LuArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
          </Reveal>

          <div className="space-y-6 lg:col-span-5">
            <Reveal delay={80} className="card p-6">
              <h3 className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">Research interests</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {research.interests.map((r) => (
                  <li
                    key={r}
                    className="rounded-full border border-line bg-bg px-3 py-1.5 text-[13.5px] font-medium text-fg-2"
                  >
                    {r}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={140} className="card p-6">
              <h3 className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">Education</h3>
              <ol className="mt-4 space-y-4">
                {education.slice(0, 3).map((e) => (
                  <li key={e.degree} className="flex gap-4">
                    <span className="mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                      <LuGraduationCap className="size-4" aria-hidden />
                    </span>
                    <div>
                      <p className="font-semibold text-fg">
                        {e.degree}
                        {e.field && <span className="font-normal text-fg-2">, {e.field}</span>}
                      </p>
                      <p className="text-sm text-muted">
                        {e.institution} · {e.year}
                        {e.honor && <span className="font-medium text-gold"> · {e.honor}</span>}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Research themes ─────────────────────────────────── */}
      <section className="container-page py-20" aria-labelledby="themes">
        <Reveal>
          <SectionHeading
            id="themes"
            title="Research areas"
            description={`My work spans ${countWord(themes.length).toLowerCase()} connected areas, from questions about human behavior to the models and systems that answer them.`}
            action={{ href: "/research/", label: "More about my research" }}
          />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {themes.map((t, i) => {
            const count = publications.filter((p) => p.themes.includes(t.key)).length;
            return (
              <Reveal key={t.key} delay={i * 70}>
                <Link
                  href={`/research/#${t.key}`}
                  className="group card flex h-full flex-col p-6 transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-lg"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-on-primary">
                    <ThemeIcon icon={t.icon} />
                  </span>
                  <h3 className="mt-5 font-serif text-xl leading-snug font-medium text-fg">{t.title}</h3>
                  <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-fg-2">{t.short}</p>
                  <p className="mt-5 flex items-center justify-between border-t border-line pt-4 text-[13px] text-muted">
                    {count} publications
                    <LuArrowUpRight
                      className="size-4 text-primary opacity-0 transition group-hover:opacity-100"
                      aria-hidden
                    />
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── News + side cards ───────────────────────────────── */}
      <section className="border-y border-line bg-surface/50" aria-labelledby="news">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionHeading id="news" title="Recent news" />
            </Reveal>
            <ol className="relative mt-8 border-l border-line pl-6">
              {news.map((n, i) => (
                <Reveal as="li" key={n.id} delay={i * 50} className="relative pb-7 last:pb-0">
                  <span
                    className="absolute top-1.5 -left-[29px] size-[9px] rounded-full bg-gold-bright ring-4 ring-bg"
                    aria-hidden
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-fg tabular-nums">{n.date}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${newsTone[n.kind]}`}
                    >
                      {n.kind}
                    </span>
                  </div>
                  <p className="mt-1.5 leading-relaxed text-fg-2">
                    {n.href ? (
                      n.href.startsWith("http") ? (
                        <a
                          href={n.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition hover:text-primary"
                        >
                          {n.text}
                        </a>
                      ) : (
                        <Link href={n.href} className="transition hover:text-primary">
                          {n.text}
                        </Link>
                      )
                    ) : (
                      n.text
                    )}
                  </p>
                </Reveal>
              ))}
            </ol>
          </div>

          <div className="space-y-6 lg:col-span-5 lg:pt-16">
            <Reveal className="relative overflow-hidden rounded-2xl bg-ink p-7 text-on-ink shadow-card-lg">
              <div
                className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-gold-bright/20 blur-2xl"
                aria-hidden
              />
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-white/10 text-gold-bright">
                <LuBookMarked className="size-5" aria-hidden />
              </span>
              <p className="mt-5 text-xs font-semibold tracking-[0.14em] text-on-ink-muted uppercase">Authored book</p>
              <h3 className="mt-2 font-serif text-2xl leading-snug font-medium">{book.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-on-ink-muted">{book.description}</p>
              {book.url && (
                <a
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative mt-5 inline-flex items-center gap-1 text-sm font-semibold text-gold-bright hover:underline"
                >
                  About the book <LuArrowUpRight className="size-4" aria-hidden />
                </a>
              )}
            </Reveal>
            {youtube && (
              <Reveal delay={80}>
                <a
                  href={youtube.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group card flex items-center gap-5 p-6 transition hover:-translate-y-0.5 hover:shadow-card-lg"
                >
                  <span className="relative inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#e62117] text-white">
                    <LuPlay className="size-6 translate-x-px fill-current" aria-hidden />
                  </span>
                  <span className="flex-1">
                    <span className="block text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                      YouTube channel
                    </span>
                    <span className="mt-1 block font-serif text-xl font-medium text-fg">
                      {youtube.label.replace(/^YouTube:\s*/, "")}
                    </span>
                    <span className="block text-sm text-fg-2">
                      {youtube.handle
                        ? `youtube.com/${youtube.handle}`
                        : youtube.href.replace(/^https?:\/\/(www\.)?/, "")}
                    </span>
                  </span>
                  <LuArrowUpRight className="size-5 text-muted transition group-hover:text-primary" aria-hidden />
                </a>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ── Selected publications ───────────────────────────── */}
      <section className="container-page py-20" aria-labelledby="selected">
        <Reveal>
          <SectionHeading
            id="selected"
            title="Selected publications"
            description={`Representative work from ${publications.length} peer-reviewed journal articles, book chapters and conference papers.`}
            action={{ href: "/publications/", label: "All publications" }}
          />
        </Reveal>
        <ol className="mt-10 divide-y divide-line border-y border-line">
          {featured.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 50} className="py-7">
              <PublicationItem pub={p} selfNames={profile.authorNames} />
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ── Teaching quote ──────────────────────────────────── */}
      <section className="container-page" aria-labelledby="philosophy">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-on-ink sm:px-14 sm:py-20">
          <div className="bg-grid-ink pointer-events-none absolute inset-0" aria-hidden />
          <div
            className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-primary/30 blur-3xl"
            aria-hidden
          />
          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <LuQuote className="size-10 text-gold-bright" aria-hidden />
              <h2 id="philosophy" className="sr-only">
                Teaching philosophy
              </h2>
              <blockquote className="mt-6 font-serif text-2xl leading-snug font-light sm:text-[2.1rem] sm:leading-[1.3]">
                Education is not merely about imparting knowledge but also about nurturing{" "}
                <em className="text-gold-bright">critical thinking</em>, problem-solving skills, and a passion for{" "}
                <em className="text-gold-bright">continuous learning</em>.
              </blockquote>
              <p className="mt-6 text-sm text-on-ink-muted">Teaching philosophy · “{philosophy.title}”</p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <Link
                href="/teaching/"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5"
              >
                Teaching &amp; courses <LuArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Contact CTA ─────────────────────────────────────── */}
      <section className="container-page pt-20" aria-labelledby="collab">
        <Reveal className="card grid gap-8 p-8 sm:p-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <h2
              id="collab"
              className="font-serif text-[1.9rem] leading-tight font-medium tracking-[-0.01em] text-fg sm:text-[2.2rem]"
            >
              Prospective students and collaborators
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-fg-2">
              I welcome students looking for a thesis or project in machine learning, human behavior analysis or data
              visualization, and researchers interested in collaborating. Please get in touch by email.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition hover:bg-primary-hover"
            >
              <LuMail className="size-4" aria-hidden /> Email me
            </a>
            <Link
              href="/contact/"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm font-semibold text-fg transition hover:border-fg/40"
            >
              Contact details
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
