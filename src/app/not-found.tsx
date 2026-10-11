import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { SiteChrome } from "@/components/SiteChrome";

export default function NotFound() {
  return (
    <SiteChrome>
      <section className="container-page flex min-h-[60vh] flex-col items-start justify-center py-24">
        <p className="text-[13px] font-semibold text-muted">Error 404</p>
        <h1 className="mt-3 font-serif text-5xl font-medium tracking-tight">Page not found</h1>
        <p className="mt-4 max-w-md text-fg-2">The page you are looking for has moved or no longer exists.</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary"
        >
          <LuArrowLeft className="size-4" aria-hidden /> Back to home
        </Link>
      </section>
    </SiteChrome>
  );
}
