import type { Metadata } from "next";
import { LuArrowUpRight, LuMail, LuMapPin, LuPhone } from "react-icons/lu";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { socialIcons } from "@/components/SocialLinks";
import { getContent } from "@/content/store";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getContent();
  return {
    title: "Contact",
    description: `Contact ${profile.name}: email, phone and office at ${profile.office.building}, ${profile.office.campus}.`,
  };
}

export default async function ContactPage() {
  const { profile, socials } = await getContent();

  return (
    <>
      <PageHeader
        title="Contact"
        description="Email is the best way to reach me about research collaboration, thesis supervision, invited talks or other academic matters."
      />

      <section className="container-page py-16">
        <div className="grid gap-5 md:grid-cols-3">
          <Reveal>
            <a
              href={`mailto:${profile.email}`}
              className="group card flex h-full flex-col p-7 transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-lg"
            >
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary text-on-primary">
                <LuMail className="size-5" aria-hidden />
              </span>
              <span className="mt-6 text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                Email (preferred)
              </span>
              <span className="mt-1.5 font-serif text-xl font-medium break-all text-fg group-hover:text-primary">
                {profile.email}
              </span>
            </a>
          </Reveal>
          <Reveal delay={70} className="card flex h-full flex-col p-7">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <LuPhone className="size-5" aria-hidden />
            </span>
            <span className="mt-6 text-xs font-semibold tracking-[0.14em] text-muted uppercase">Phone</span>
            <ul className="mt-1.5 space-y-1">
              {profile.phones.map((p) => (
                <li key={p}>
                  <a
                    href={`tel:${p.replace(/[^+\d]/g, "")}`}
                    className="font-serif text-xl font-medium text-fg hover:text-primary"
                  >
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={140}>
            <a
              href={profile.office.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group card flex h-full flex-col p-7 transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-lg"
            >
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-gold-soft text-gold">
                <LuMapPin className="size-5" aria-hidden />
              </span>
              <span className="mt-6 text-xs font-semibold tracking-[0.14em] text-muted uppercase">Office</span>
              <span className="mt-1.5 font-serif text-xl leading-snug font-medium text-fg">
                {profile.office.building}, {profile.office.room}
              </span>
              <span className="mt-1 text-sm text-fg-2">
                {profile.office.campus}, {profile.office.city}
              </span>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Open in Google Maps <LuArrowUpRight className="size-4" aria-hidden />
              </span>
            </a>
          </Reveal>
        </div>

        <Reveal className="mt-16">
          <h2 className="font-serif text-[1.9rem] leading-tight font-medium tracking-[-0.01em] text-fg sm:text-[2.2rem]">
            Academic and social profiles
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {socials.map((s) => {
              const Icon = socialIcons[s.key];
              return (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition hover:border-primary/30 hover:shadow-card"
                  >
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-surface-2 text-fg-2 transition group-hover:bg-primary group-hover:text-on-primary">
                      <Icon className="size-[18px]" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-fg">{s.label}</span>
                      <span className="block truncate text-sm text-muted">
                        {s.handle ?? new URL(s.href).hostname.replace("www.", "")}
                      </span>
                    </span>
                    <LuArrowUpRight className="size-4 text-muted transition group-hover:text-primary" aria-hidden />
                  </a>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </section>
    </>
  );
}
