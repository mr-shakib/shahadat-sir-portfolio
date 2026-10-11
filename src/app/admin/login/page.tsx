import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";
import { LoginForm } from "@/components/admin/LoginForm";
import { adminConfigured, isAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await isAdmin()) redirect("/admin/");
  const { next } = await searchParams;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <p className="border-t border-fg/80 pt-3 text-[13px] font-semibold text-fg">Site admin</p>
        <h1 className="mt-8 font-serif text-4xl font-medium tracking-tight">Sign in</h1>
        <p className="mt-2 text-fg-2">Edit teaching, publications, supervision and everything else on the site.</p>

        {adminConfigured() ? (
          <LoginForm next={next} />
        ) : (
          <div className="mt-8 rounded-xl border border-danger/30 bg-danger-soft p-4 text-sm text-fg">
            <p className="font-semibold">The admin is not set up yet.</p>
            <p className="mt-1 text-fg-2">
              Set <code>DATABASE_URL</code>, <code>ADMIN_PASSWORD</code> and <code>SESSION_SECRET</code> (32+
              characters) in the server environment, then restart it.
            </p>
          </div>
        )}

        <Link href="/" className="mt-10 inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
          <LuArrowLeft className="size-4" aria-hidden /> Back to the site
        </Link>
      </div>
    </main>
  );
}
