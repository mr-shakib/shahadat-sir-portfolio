import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader, Notice } from "@/components/admin/AdminHeader";
import { EntryForm } from "@/components/admin/EntryForm";
import { getSpec, type ListSpec } from "@/content/schema";
import { getEntry, loadSources } from "@/content/store";
import { optionList } from "@/content/validate";
import { requireAdmin } from "@/lib/auth";
import { uploadConfig } from "@/lib/env";

type Props = {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ added?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const spec = getSpec((await params).collection);
  return { title: spec ? `Add ${spec.singular}` : undefined };
}

export default async function NewEntryPage({ params, searchParams }: Props) {
  await requireAdmin();
  const [{ collection }, { added }] = await Promise.all([params, searchParams]);
  const spec = getSpec(collection);
  if (spec?.kind !== "list") notFound();
  const list = spec as ListSpec;

  const [sources, previous] = await Promise.all([loadSources(), added ? getEntry(list.key, added) : null]);

  // Required choices start on their first option (for universities, the current one).
  const initial: Record<string, unknown> = {};
  for (const f of list.fields) {
    if (f.type === "select" && f.required) {
      const first = optionList(f.options, sources)[0];
      if (first) initial[f.name] = first.value;
    }
  }
  // After "Save and add another", keep the fields that usually repeat.
  for (const name of list.carry ?? []) {
    if (previous?.data[name] !== undefined) initial[name] = previous.data[name];
  }

  return (
    <>
      <AdminHeader
        crumbs={[{ href: `/admin/${list.key}/`, label: list.label }]}
        title={`Add ${list.singular}`}
        description={list.description}
      />
      {previous && (
        <Notice>
          <span className="font-semibold">Added</span>
          <span className="min-w-0 truncate text-fg-2">“{list.title(previous.data as never)}”</span>
        </Notice>
      )}
      <EntryForm
        key={added ?? "new"}
        collection={list.key}
        initial={initial}
        sources={sources}
        uploads={uploadConfig()}
      />
    </>
  );
}
