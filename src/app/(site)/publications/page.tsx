import type { Metadata } from "next";
import { LuArrowUpRight, LuBookMarked, LuMic, LuPresentation } from "react-icons/lu";
import { PageHeader, StatRow } from "@/components/PageHeader";
import { PublicationBrowser } from "@/components/PublicationBrowser";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SocialLinks } from "@/components/SocialLinks";
import { joinAnd, publicationStats } from "@/content/derive";
import { getContent } from "@/content/store";

export const metadata: Metadata = {
  title: "Publications",
  description:
    "Peer-reviewed journal articles, book chapters and conference papers by Shahadat Hossain, with DOI links and BibTeX citations.",
};

export default async function PublicationsPage() {
  const { profile, publications, themes, research, socials, book, talks } = await getContent();
  const stats = publicationStats(publications, profile.authorNames);

  return (
    <>
      <PageHeader
        title="Publications"
        description={
          <>
            Peer-reviewed journal articles, book chapters and conference papers, published with{" "}
            {joinAnd(research.publishers)}. My name is{" "}
            <span className="font-semibold text-fg underline decoration-gold-bright/70 decoration-2 underline-offset-[3px]">
              underlined
            </span>{" "}
            in author lists, and <em>Cite</em> gives each reference in APA or BibTeX.
          </>
        }
      >
        <StatRow
          stats={[
            { value: stats.total, label: "Total publications" },
            { value: stats.journal + stats.chapter, label: "Journal articles and chapters" },
            { value: stats.conference, label: "Conference papers" },
            { value: stats.firstAuthor, label: "As first author" },
          ]}
        />
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
          <span>Full, up-to-date list on</span>
          <SocialLinks socials={socials} only={["scholar", "researchgate"]} size="sm" />
        </div>
      </PageHeader>

      <section className="container-page pt-12">
        <PublicationBrowser publications={publications} themes={themes} selfNames={profile.authorNames} />
      </section>

      {/* Book + talks */}
      <section className="container-page pt-24">
        <Reveal>
          <SectionHeading title="Book and talks" />
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <Reveal className="relative overflow-hidden rounded-2xl bg-ink p-8 text-on-ink shadow-card-lg lg:col-span-5">
            <div
              className="pointer-events-none absolute -right-10 -bottom-10 size-56 rounded-full bg-primary/30 blur-3xl"
              aria-hidden
            />
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-white/10 text-gold-bright">
              <LuBookMarked className="size-6" aria-hidden />
            </span>
            <p className="mt-6 text-xs font-semibold tracking-[0.14em] text-on-ink-muted uppercase">Authored book</p>
            <h3 className="mt-2 font-serif text-[1.75rem] leading-tight font-medium">{book.title}</h3>
            <p className="mt-3 leading-relaxed text-on-ink-muted">{book.description}</p>
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
          <Reveal delay={80} className="card p-2 lg:col-span-7">
            <ul className="divide-y divide-line">
              {talks.map((t) => (
                <li key={t.id} className="flex gap-4 p-5">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                    {t.event.toLowerCase().includes("symposium") ? (
                      <LuPresentation className="size-[18px]" aria-hidden />
                    ) : (
                      <LuMic className="size-[18px]" aria-hidden />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium leading-snug text-fg">{t.title}</p>
                    <p className="mt-1 text-sm text-muted">{[t.event, t.host, t.date].filter(Boolean).join(" · ")}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
