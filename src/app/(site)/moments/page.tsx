import type { Metadata } from "next";
import type { IconType } from "react-icons";
import { LuBriefcase, LuFlaskConical, LuGraduationCap, LuHeartHandshake, LuPresentation } from "react-icons/lu";
import { MomentPhotos } from "@/components/MomentPhotos";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { getContent } from "@/content/store";
import type { MomentCategory } from "@/content/types";

export const metadata: Metadata = {
  title: "Memorable Moments",
  description:
    "Milestones from Shahadat Hossain’s academic and professional journey: convocations, conferences, talks and campus life.",
};

const categoryStyle: Record<MomentCategory, { icon: IconType; tone: string }> = {
  Academic: { icon: LuGraduationCap, tone: "bg-primary-soft text-primary" },
  Research: { icon: LuFlaskConical, tone: "bg-primary-soft text-primary" },
  Teaching: { icon: LuPresentation, tone: "bg-gold-soft text-gold" },
  Industry: { icon: LuBriefcase, tone: "bg-surface-2 text-fg-2" },
  Life: { icon: LuHeartHandshake, tone: "bg-surface-2 text-fg-2" },
};

export default async function MomentsPage() {
  const { moments } = await getContent();
  const years = Array.from(new Set(moments.map((m) => m.year))).sort((a, b) => b - a);

  return (
    <>
      <PageHeader
        title="Memorable moments"
        description="Convocations, conferences, talks, campus events and moments with family and friends, from my first day at university to today."
      />

      <div className="container-page py-16">
        {years.map((y) => (
          <section
            key={y}
            aria-labelledby={`m-${y}`}
            className="grid gap-6 border-t border-line py-12 first:border-t-0 first:pt-0 md:grid-cols-[160px_minmax(0,1fr)]"
          >
            <div className="md:sticky md:top-24 md:self-start">
              <h2 id={`m-${y}`} className="font-serif text-5xl font-normal tracking-[-0.02em] text-fg">
                {y}
              </h2>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {moments
                .filter((m) => m.year === y)
                .map((m, i) => {
                  const { icon: Icon, tone } = categoryStyle[m.category];
                  return (
                    <Reveal as="li" key={m.id} delay={(i % 4) * 60} className="card overflow-hidden">
                      {m.images.length ? <MomentPhotos images={m.images} title={m.title} /> : null}
                      <div className="p-6">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ${tone}`}
                        >
                          <Icon className="size-3.5" aria-hidden /> {m.category}
                        </span>
                        <h3 className="mt-3 font-serif text-xl leading-snug font-medium text-fg">{m.title}</h3>
                        <p className="mt-2 text-[14.5px] leading-relaxed text-fg-2">{m.caption}</p>
                      </div>
                    </Reveal>
                  );
                })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
