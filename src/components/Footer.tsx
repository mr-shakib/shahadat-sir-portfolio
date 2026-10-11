import Link from "next/link";
import { LuMail, LuMapPin, LuPhone } from "react-icons/lu";
import { navigation } from "@/content/site";
import type { Content } from "@/content/types";
import { SocialLinks } from "./SocialLinks";

export function Footer({ content }: { content: Content }) {
  const { profile, socials, updatedAt } = content;
  const lastUpdated = updatedAt.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "Asia/Dhaka" });

  return (
    <footer className="relative mt-24 overflow-hidden bg-ink text-on-ink">
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[80%] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
        aria-hidden
      />
      <div className="container-page relative grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-serif text-2xl font-medium tracking-tight">{profile.name}</p>
          <p className="mt-2 text-sm leading-relaxed text-on-ink-muted">
            {profile.title}, {profile.department}
            <br />
            {profile.university}, {profile.location}
          </p>
          {profile.motto && <p className="mt-6 font-serif text-lg text-gold-bright italic">“{profile.motto}”</p>}
          <div className="mt-6">
            <SocialLinks socials={socials} variant="ink" size="sm" />
          </div>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="text-xs font-semibold tracking-[0.14em] text-on-ink-muted uppercase">Explore</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
            {navigation.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-on-ink/90 transition hover:text-on-ink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="text-xs font-semibold tracking-[0.14em] text-on-ink-muted uppercase">Contact</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <LuMail className="mt-0.5 size-4 shrink-0 text-gold-bright" aria-hidden />
              <a href={`mailto:${profile.email}`} className="break-all hover:underline">
                {profile.email}
              </a>
            </li>
            {profile.phones.length > 0 && (
              <li className="flex gap-3">
                <LuPhone className="mt-0.5 size-4 shrink-0 text-gold-bright" aria-hidden />
                <span>{profile.phones.join(" · ")}</span>
              </li>
            )}
            <li className="flex gap-3">
              <LuMapPin className="mt-0.5 size-4 shrink-0 text-gold-bright" aria-hidden />
              <span>
                {profile.office.building}, {profile.office.room}
                <br />
                {profile.office.campus}, {profile.office.city}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-on-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <p>Last updated {lastUpdated}</p>
        </div>
      </div>
    </footer>
  );
}
