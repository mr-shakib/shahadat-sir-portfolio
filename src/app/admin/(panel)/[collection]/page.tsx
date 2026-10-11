import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuPlus } from "react-icons/lu";
import { AdminHeader, Notice, ViewOnSite } from "@/components/admin/AdminHeader";
import { EntryForm } from "@/components/admin/EntryForm";
import { EntryList, type Row } from "@/components/admin/EntryList";
import { getSpec, sourceKey, type ListSpec } from "@/content/schema";
import { getSingle, listEntries, loadSources } from "@/content/store";
import type { SourceOptions } from "@/content/validate";
import { requireAdmin } from "@/lib/auth";
import { uploadConfig } from "@/lib/env";

type Props = {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getSpec((await params).collection)?.label };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  await requireAdmin();
  const [{ collection }, { saved }] = await Promise.all([params, searchParams]);
  const spec = getSpec(collection);
  if (!spec) notFound();

  if (spec.kind === "single") {
    const [entry, sources] = await Promise.all([getSingle(spec.key), loadSources()]);
    return (
      <>
        <AdminHeader title={spec.label} description={spec.description} actions={<ViewOnSite href={spec.href} />} />
        {saved && (
          <Notice>
            <span className="font-semibold">Saved.</span> The site is updated.
          </Notice>
        )}
        <EntryForm
          key={entry?.updatedAt}
          collection={spec.key}
          initial={entry?.data ?? {}}
          updatedAt={entry?.updatedAt}
          sources={sources}
          uploads={uploadConfig()}
        />
      </>
    );
  }

  const list = spec as ListSpec;
  const [entries, sources] = await Promise.all([
    listEntries(list.key),
    list.parent ? loadSources() : Promise.resolve<SourceOptions>({}),
  ]);
  const parentLabel = (value: unknown) =>
    (list.parent && sources[sourceKey(list.parent)]?.find((o) => o.value === value)?.label) ?? String(value);
  const rows: Row[] = entries.map((e) => ({
    id: e.id,
    title: list.title(e.data as never),
    meta: list.meta?.(e.data as never) ?? "",
    group: list.parent
      ? parentLabel(e.data[list.parent.field])
      : list.order === "year"
        ? String(e.data.year)
        : undefined,
  }));
  const savedRow = rows.find((r) => r.id === saved);

  return (
    <>
      <AdminHeader
        title={list.label}
        description={list.description}
        actions={
          <>
            <ViewOnSite href={list.href} />
            <Link href={`/admin/${list.key}/new/`} className="btn btn-primary">
              <LuPlus className="size-4" aria-hidden /> Add {list.singular}
            </Link>
          </>
        }
      />
      {savedRow && (
        <Notice>
          <span className="font-semibold">Saved</span>
          <span className="min-w-0 truncate text-fg-2">“{savedRow.title}”</span>
        </Notice>
      )}
      <EntryList
        collection={list.key}
        rows={rows}
        reorder={list.order === "manual"}
        savedId={saved}
        empty={`No ${list.label.toLowerCase()} yet. Use “Add ${list.singular}” to create the first one.`}
      />
    </>
  );
}
