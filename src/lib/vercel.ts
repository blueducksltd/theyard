import { put, del } from "@vercel/blob";

export async function uploadImage(file: File): Promise<string> {
  // Validate
  const MAX_SIZE = 4.5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error("File too large (max 4.5MB)");
  }

  try {
    const timestamp = Date.now();
    const filename = `uploads/${timestamp}-${file.name}`;

    const blob = await put(filename, file, {
      access: "public",
    });

    return blob.url;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Upload error:", err);
    throw new Error(`Upload failed: ${err.message}`);
  }
}

export async function deleteImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return;

  try {
    await del(imageUrl);
  } catch (err) {
    console.error("Delete error:", err);
  }
}
