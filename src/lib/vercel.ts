import { put, del } from "@vercel/blob";
import sharp from "sharp";

export async function uploadImage(file: File): Promise<string> {
  try {
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert to WebP with sharp
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 80 }) // Adjust quality (1-100)
      .resize(1920, 1920, {
        // Max dimensions
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer();

    console.log("Original size:", (buffer.length / 1024).toFixed(2), "KB");
    console.log("WebP size:", (webpBuffer.length / 1024).toFixed(2), "KB");

    // Generate filename with .webp extension
    const timestamp = Date.now();
    const filename = `uploads/${timestamp}.webp`;

    // Upload to Vercel Blob
    const blob = await put(filename, webpBuffer, {
      access: "public",
      contentType: "image/webp",
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
