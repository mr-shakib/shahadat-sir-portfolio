import type { ReactNode } from "react";
import { getContent } from "@/content/store";
import { Footer } from "./Footer";
import { Header } from "./Header";

/** Header, main landmark and footer around every public page. */
export async function SiteChrome({ children }: { children: ReactNode }) {
  const content = await getContent();
  const { profile } = content;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
      >
        Skip to content
      </a>
      <Header name={profile.name} title={profile.title} org={profile.universityShort} cv={profile.cv} />
      <main id="main">{children}</main>
      <Footer content={content} />
    </>
  );
}
