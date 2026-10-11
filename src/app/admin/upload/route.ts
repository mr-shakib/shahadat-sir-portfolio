import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdmin } from "@/lib/auth";
import { uploadConfig } from "@/lib/env";

/**
 * Issues short-lived tokens so the admin can upload photos and PDFs straight to Vercel Blob.
 * Only used when a Blob store is connected (BLOB_READ_WRITE_TOKEN); see src/lib/env.ts.
 */
export async function POST(request: Request) {
  if (uploadConfig().storage !== "blob")
    return Response.json({ error: "Uploads go to the database here." }, { status: 404 });
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      // Runs for token requests from the admin's browser. Completion callbacks from Vercel skip it
      // and are verified by their signature inside handleUpload.
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAdmin())) throw new Error("Sign in to upload files.");
        if (!/^(images|files)\/[\w.-]+$/.test(pathname)) throw new Error("Unexpected file name.");
        return {
          allowedContentTypes: pathname.startsWith("images/")
            ? ["image/jpeg", "image/png", "image/webp"]
            : ["application/pdf"],
          maximumSizeInBytes: uploadConfig().maxBytes,
          addRandomSuffix: true,
          cacheControlMaxAge: 60 * 60 * 24 * 365,
        };
      },
    });
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
