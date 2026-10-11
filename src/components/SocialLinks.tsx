import type { IconType } from "react-icons";
import { FaFacebookF, FaGithub, FaLinkedinIn, FaOrcid, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { LuGlobe } from "react-icons/lu";
import { SiGooglescholar, SiResearchgate } from "react-icons/si";
import type { Social, SocialKey } from "@/content/types";

export const socialIcons: Record<SocialKey, IconType> = {
  scholar: SiGooglescholar,
  researchgate: SiResearchgate,
  orcid: FaOrcid,
  linkedin: FaLinkedinIn,
  github: FaGithub,
  youtube: FaYoutube,
  facebook: FaFacebookF,
  x: FaXTwitter,
  website: LuGlobe,
};

type Props = {
  socials: Social[];
  only?: SocialKey[];
  variant?: "default" | "ink";
  size?: "sm" | "md";
};

export function SocialLinks({ socials, only, variant = "default", size = "md" }: Props) {
  const items = only ? socials.filter((s) => only.includes(s.key)) : socials;
  const box = size === "sm" ? "size-8" : "size-10";
  const icon = size === "sm" ? "size-3.5" : "size-4";
  const tone =
    variant === "ink"
      ? "border-white/15 text-on-ink-muted hover:border-white/40 hover:text-on-ink"
      : "border-line bg-surface text-fg-2 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-card";

  return (
    <ul className="flex flex-wrap items-center gap-2">
      {items.map((s) => {
        const Icon = socialIcons[s.key];
        return (
          <li key={s.href}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
              className={`inline-flex ${box} items-center justify-center rounded-full border transition ${tone}`}
            >
              <Icon className={icon} aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
