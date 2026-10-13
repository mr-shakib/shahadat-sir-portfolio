import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { LuArrowRight, LuDownload, LuMail, LuMapPin } from "react-icons/lu";
import { SocialLinks } from "@/components/SocialLinks";
import { teachingSince } from "@/content/derive";
import type { Content } from "@/content/types";

const delay = (ms: number) => ({ "--rise-delay": `${ms}ms` }) as CSSProperties;

export function Hero({ content }: { content: Content }) {
  const { profile, research, socials } = content;
  const caption = profile.photoCaption;
  const stats = [
    { value: content.publications.length, label: "Peer-reviewed publications" },
    { value: `${new Date().getFullYear() - teachingSince(content)}+`, label: "Years of university teaching" },
    { value: content.supervision.length, label: "Theses & projects supervised" },
  ];

  return (
    <>
      <section aria-labelledby="hero-name" className="overflow-x-clip border-b border-line bg-surface">
        <div className="container-page grid lg:min-h-[min(calc(100svh-4rem),760px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.68fr)] lg:gap-16">
          {/* Portrait: full-bleed to the right edge on desktop */}
          <div className="relative -mx-4 aspect-[4/5] overflow-hidden bg-surface-2 sm:-mx-6 sm:aspect-[16/11] lg:order-2 lg:mx-0 lg:-mr-[max(2rem,calc((100vw-72rem)/2+2rem))] lg:aspect-auto">
            <Image
              src={profile.photo}
              alt={`Portrait of ${profile.name}`}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="photo-in object-cover object-[50%_10%] sm:object-[50%_18%] lg:object-[50%_6%]"
            />
            {caption?.title && (
              <>
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0b1324]/75 via-[#0b1324]/25 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                  <p className="text-[12px] font-semibold tracking-[0.12em] text-white/70 uppercase">
                    {caption.label || "Currently"}
                  </p>
                  <p className="mt-1 text-[15px] font-semibold">{caption.title}</p>
                  {caption.detail && <p className="text-[13.5px] text-white/80">{caption.detail}</p>}
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <div className="flex flex-col justify-center py-12 sm:py-16 lg:order-1 lg:py-20">
            <p className="rise inline-flex items-center gap-2.5 text-[13px] font-semibold text-primary">
              <span className="h-[3px] w-6 rounded-full bg-primary" aria-hidden />
              {profile.department}
            </p>
            <h1
              id="hero-name"
              style={delay(60)}
              className="rise mt-5 font-serif text-[clamp(2.75rem,5.4vw,4.5rem)] leading-[1.02] font-medium tracking-[-0.02em] text-fg"
            >
              {profile.name}
            </h1>
            <p style={delay(120)} className="rise mt-4 text-lg text-fg sm:text-xl">
              {profile.title},{" "}
              <a
                href={profile.universityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline decoration-line-strong underline-offset-4 transition hover:decoration-primary"
              >
                {profile.university}
              </a>
            </p>
            <p style={delay(180)} className="rise mt-6 max-w-xl text-[1.05rem] leading-relaxed text-fg-2">
              {profile.intro}
            </p>

            <ul style={delay(220)} className="rise mt-5 flex max-w-xl flex-wrap gap-2">
              {profile.focusAreas.map((a) => (
                <li key={a} className="rounded-md bg-primary-soft px-2.5 py-1 text-[13px] font-medium text-primary">
                  {a}
                </li>
              ))}
            </ul>

            <div style={delay(280)} className="rise mt-8 flex flex-wrap items-center gap-3">
              <a
                href={profile.cv}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-on-primary shadow-card transition hover:bg-primary-hover"
              >
                <LuDownload className="size-4" aria-hidden /> Download CV
              </a>
              <Link
                href="/publications/"
                className="group inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface px-5 py-3 text-sm font-semibold text-fg transition hover:border-fg/40"
              >
                View publications
                <LuArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>

            <div
              style={delay(340)}
              className="rise mt-7 flex flex-col gap-2 text-sm text-fg-2 sm:flex-row sm:flex-wrap sm:gap-x-6"
            >
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 transition hover:text-primary"
              >
                <LuMail className="size-4 text-muted" aria-hidden /> {profile.email}
              </a>
              <span className="inline-flex items-center gap-2">
                <LuMapPin className="size-4 text-muted" aria-hidden /> {profile.office.building},{" "}
                {profile.office.room.split(",")[0]}
              </span>
            </div>

            <dl
              style={delay(400)}
              className="rise mt-10 grid max-w-xl grid-cols-3 divide-x divide-line border-t border-line pt-6"
            >
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse justify-end px-4 first:pl-0">
                  <dt className="mt-1 text-[12.5px] leading-snug text-muted">{s.label}</dt>
                  <dd className="text-3xl font-semibold tracking-tight text-fg">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Credentials strip */}
      <section aria-label="Publishers and profiles" className="border-b border-line bg-bg">
        <div className="container-page flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
            <p className="shrink-0 text-[12px] font-semibold tracking-[0.12em] text-muted uppercase">Published with</p>
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
              {research.publishers.map((p) => (
                <li key={p} className="text-[17px] font-semibold tracking-tight text-fg-2/80">
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <SocialLinks socials={socials} size="sm" />
        </div>
      </section>
    </>
  );
}
