"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { getSpec, specs } from "@/content/schema";
import {
  createEntry,
  deleteEntry,
  findDuplicate,
  getEntry,
  loadSources,
  moveEntry,
  referencesOf,
  saveMedia,
  saveSingle,
  updateEntry,
} from "@/content/store";
import { validate, type Errors } from "@/content/validate";
import { renderMarkdown } from "@/lib/markdown";
import {
  adminConfigured,
  clearFailedLogins,
  endSession,
  loginBlockedFor,
  passwordMatches,
  recordFailedLogin,
  requireAdmin,
  startSession,
} from "@/lib/auth";

// ── Session ───────────────────────────────────────────────────────────

export async function login(_state: { error?: string } | undefined, form: FormData) {
  if (!adminConfigured())
    return { error: "The admin is not set up yet: DATABASE_URL, ADMIN_PASSWORD and SESSION_SECRET are required." };
  const wait = await loginBlockedFor();
  if (wait) return { error: `Too many attempts. Try again in ${wait} minute${wait === 1 ? "" : "s"}.` };

  if (!passwordMatches(String(form.get("password") ?? ""))) {
    await recordFailedLogin();
    await new Promise((r) => setTimeout(r, 500));
    return { error: "That password is not correct." };
  }
  await clearFailedLogins();
  await startSession();
  const next = String(form.get("next") ?? "");
  redirect(/^\/admin\/[\w\-/]*$/.test(next) ? next : "/admin/");
}

export async function logout() {
  await endSession();
  redirect("/admin/login/");
}

// ── Content ───────────────────────────────────────────────────────────

export type SaveResult = { errors: Errors; message: string } | undefined;

/** Every public page reads all content, so any change refreshes the whole site. */
const refreshSite = () => revalidatePath("/", "layout");

export async function saveItem(input: {
  collection: string;
  id?: string;
  data: unknown;
  updatedAt?: string;
  next?: "list" | "new";
}): Promise<SaveResult> {
  await requireAdmin();
  const spec = getSpec(input.collection);
  if (!spec) return { errors: {}, message: "Unknown section." };

  const { data, errors, ok } = validate(spec.fields, input.data, await loadSources());
  if (!ok) return { errors, message: "Some fields need attention." };

  const conflict = {
    errors: {},
    message: "Someone else saved this while you were editing. Reload the page to see their version.",
  };

  if (spec.kind === "single") {
    if ((await saveSingle(spec.key, data, input.updatedAt)) === "conflict") return conflict;
    refreshSite();
    redirect(`/admin/${spec.key}/?saved=1`);
  }

  if (spec.unique && (await findDuplicate(spec.key, spec.unique, data, input.id))) {
    const fields = spec.unique.map((name) => spec.fields.find((f) => f.name === name)?.label.toLowerCase() ?? name);
    return {
      errors: Object.fromEntries(spec.unique.map((name) => [name, "Already used"])),
      message: `There is already a ${spec.singular} with this ${fields.join(" and ")}.`,
    };
  }

  let id = input.id;
  if (id) {
    const result = await updateEntry(spec.key, id, data, input.updatedAt);
    if (result === "missing") return { errors: {}, message: "This item has been deleted in the meantime." };
    if (result === "conflict") return conflict;
  } else {
    id = await createEntry(spec.key, data);
  }
  refreshSite();
  redirect(input.next === "new" ? `/admin/${spec.key}/new/?added=${id}` : `/admin/${spec.key}/?saved=${id}`);
}

export async function deleteItem(collection: string, id: string): Promise<{ error: string } | undefined> {
  await requireAdmin();
  const spec = getSpec(collection);
  if (spec?.kind !== "list") return { error: "Unknown section." };
  const entry = await getEntry(spec.key, id);
  if (!entry) return;

  const refs = await referencesOf(spec.key, entry.data);
  if (refs.length) {
    const used = refs.map(
      (r) => `${r.count} ${r.count === 1 ? specs[r.collection].singular : specs[r.collection].label.toLowerCase()}`,
    );
    return { error: `Still used by ${used.join(" and ")}. Move or delete those first.` };
  }
  await deleteEntry(spec.key, id);
  refreshSite();
}

export async function moveItem(collection: string, id: string, direction: -1 | 1) {
  await requireAdmin();
  const spec = getSpec(collection);
  if (spec?.kind !== "list" || spec.order !== "manual") return;
  await moveEntry(spec.key, id, direction === -1 ? -1 : 1);
  refreshSite();
}

/** Renders Markdown exactly as the public lecture page will. */
export async function previewMarkdown(source: string) {
  await requireAdmin();
  return renderMarkdown(String(source ?? "").slice(0, 200000)).html;
}

// ── Uploads ───────────────────────────────────────────────────────────

const MAX_BYTES = 10 * 1024 * 1024;

const baseName = (name: string) =>
  name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "file";

/** Stores a photo (resized, re-encoded) or a PDF and returns its public URL. */
export async function uploadFile(form: FormData): Promise<{ url: string } | { error: string }> {
  await requireAdmin();
  const file = form.get("file");
  const kind = form.get("kind") === "file" ? "file" : "image";
  if (!(file instanceof File) || !file.size) return { error: "No file was received." };
  if (file.size > MAX_BYTES) return { error: "Files must be 10 MB or smaller." };
  const bytes = Buffer.from(await file.arrayBuffer());

  if (kind === "file") {
    if (bytes.subarray(0, 5).toString("latin1") !== "%PDF-") return { error: "Only PDF files can be uploaded here." };
    const filename = `${baseName(file.name)}.pdf`;
    const id = await saveMedia({ filename, contentType: "application/pdf", bytes });
    return { url: `/media/${id}/${filename}` };
  }

  try {
    const image = sharp(bytes, { failOn: "error" });
    const { hasAlpha, format } = await image.metadata();
    // PNGs (screenshots, diagrams, code) stay lossless; photos become JPEG.
    const png = hasAlpha || format === "png";
    // Phone photos are often 4000px+; 2400px keeps them sharp on large screens at a fraction of the size.
    const pipeline = image.rotate().resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true });
    const { data, info } = await (
      png
        ? pipeline.png({ compressionLevel: 9 })
        : pipeline.flatten({ background: "#ffffff" }).jpeg({ quality: 84, mozjpeg: true })
    ).toBuffer({ resolveWithObject: true });
    const filename = `${baseName(file.name)}.${png ? "png" : "jpg"}`;
    const id = await saveMedia({
      filename,
      contentType: png ? "image/png" : "image/jpeg",
      bytes: data,
      width: info.width,
      height: info.height,
    });
    return { url: `/media/${id}/${filename}` };
  } catch {
    return { error: "This file could not be read as a photo. Use JPEG, PNG or WebP." };
  }
}
