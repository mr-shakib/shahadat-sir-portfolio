import { AdminNav } from "@/components/admin/AdminNav";
import { getSingle } from "@/content/store";
import { requireAdmin } from "@/lib/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const profile = await getSingle("profile");

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[256px_minmax(0,1fr)]">
      <AdminNav name={String(profile?.data.name ?? "Portfolio")} />
      <main className="min-w-0 px-4 pt-8 pb-28 sm:px-8 lg:px-12 lg:pt-12">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
