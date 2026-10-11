import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { joinAnd } from "@/content/derive";
import { getContent } from "@/content/store";

export async function generateMetadata(): Promise<Metadata> {
  const { profile, research } = await getContent();
  const article = /^[aeiou]/i.test(profile.title) ? "an" : "a";
  const description = `${profile.name} is ${article} ${profile.title} in the ${profile.department} at ${profile.university}, researching ${joinAnd(profile.focusAreas.map((a) => a.toLowerCase()))}.`;

  return {
    title: {
      default: `${profile.name}, ${profile.title} · ${profile.university}`,
      template: `%s · ${profile.name}`,
    },
    description,
    authors: [{ name: profile.name }],
    keywords: [
      profile.name,
      profile.title,
      profile.university,
      "Computer Science and Engineering",
      ...research.interests,
      profile.location,
    ],
    openGraph: {
      type: "profile",
      title: `${profile.name}, ${profile.title}`,
      description,
      siteName: profile.name,
      images: [{ url: profile.photo, alt: profile.name }],
    },
    twitter: { card: "summary", title: `${profile.name}, ${profile.title}`, description },
  };
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
