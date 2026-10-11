import { upload } from "@vercel/blob/client";
import { uploadFile } from "@/app/admin/actions";
import type { UploadConfig } from "@/lib/env";

const MAX_SIDE = 2400;

/**
 * Downscales photos in the browser (and drops their metadata, such as GPS position) so uploads are
 * quick and small. PNGs that need no resizing, like screenshots of code, are kept as they are.
 */
async function prepareImage(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file;
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const png = file.type === "image/png";
  if (png && scale === 1) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  const encode = (type: string) => new Promise<Blob | null>((done) => canvas.toBlob(done, type, 0.86));

  let out: Blob | null = null;
  if (png) {
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    out = await encode("image/png");
  }
  if (!png || !out || out.size > 4 * 1024 * 1024) {
    // JPEG has no transparency, so paint a white background first.
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    out = await encode("image/jpeg");
  }
  bitmap.close();
  if (!out) return file;
  const type = out.type === "image/png" ? "image/png" : "image/jpeg";
  return new File([out], file.name.replace(/\.[^.]+$/, type === "image/png" ? ".png" : ".jpg"), { type });
}

const safeName = (name: string, ext: string) =>
  `${
    name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "file"
  }.${ext}`;

/** Uploads a photo or PDF from the admin and returns its public URL, or an error to show. */
export async function uploadOne(
  file: File,
  kind: "image" | "file",
  config: UploadConfig,
): Promise<{ url: string } | { error: string }> {
  const prepared = kind === "image" ? await prepareImage(file) : file;
  if (prepared.size > config.maxBytes)
    return { error: `${file.name} is larger than ${Math.round(config.maxBytes / 1024 / 1024)} MB.` };

  try {
    if (config.storage === "blob") {
      if (kind === "file" && prepared.type && prepared.type !== "application/pdf")
        return { error: "Only PDF files can be uploaded here." };
      const ext = kind === "file" ? "pdf" : prepared.type === "image/png" ? "png" : "jpg";
      const blob = await upload(`${kind === "image" ? "images" : "files"}/${safeName(prepared.name, ext)}`, prepared, {
        access: "public",
        handleUploadUrl: "/admin/upload/",
        contentType: kind === "file" ? "application/pdf" : prepared.type,
      });
      return { url: blob.url };
    }
    const form = new FormData();
    form.set("file", prepared);
    form.set("kind", kind);
    return await uploadFile(form);
  } catch (error) {
    const message = error instanceof Error ? error.message.replace(/^Vercel Blob:\s*/, "") : "";
    return { error: message || "The upload failed. Check your connection and try again." };
  }
}
