import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader, ViewOnSite } from "@/components/admin/AdminHeader";
import { EntryForm } from "@/components/admin/EntryForm";
import { getSpec, type ListSpec } from "@/content/schema";
import { getEntry, loadSources } from "@/content/store";
import { requireAdmin } from "@/lib/auth";

type Props = { params: Promise<{ collection: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const spec = getSpec((await params).collection);
  return { title: spec ? `Edit ${spec.singular}` : undefined };
}

export default async function EditEntryPage({ params }: Props) {
  await requireAdmin();
  const { collection, id } = await params;
  const spec = getSpec(collection);
  if (spec?.kind !== "list") notFound();
  const list = spec as ListSpec;

  const [entry, sources] = await Promise.all([getEntry(list.key, id), loadSources()]);
  if (!entry) notFound();

  return (
    <>
      <AdminHeader
        crumbs={[{ href: `/admin/${list.key}/`, label: list.label }]}
        title={`Edit ${list.singular}`}
        description={list.title(entry.data as never)}
        actions={<ViewOnSite href={list.href} />}
      />
      <EntryForm
        key={entry.updatedAt}
        collection={list.key}
        id={entry.id}
        initial={entry.data}
        updatedAt={entry.updatedAt}
        sources={sources}
      />
    </>
  );
}
