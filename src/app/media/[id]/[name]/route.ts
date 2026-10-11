import { getMedia } from "@/content/store";

/** Serves photos and PDFs uploaded in the admin. URLs never change content, so they cache forever. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string; name: string }> }) {
  const { id } = await params;
  const file = await getMedia(id);
  if (!file) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(file.bytes), {
    headers: {
      "Content-Type": file.content_type,
      "Content-Length": String(file.bytes.length),
      "Content-Disposition": `inline; filename="${file.filename}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
