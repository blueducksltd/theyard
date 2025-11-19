import { put, del } from "@vercel/blob";

export async function uploadImage(file: File): Promise<string> {
  // Validate original file size
  const MAX_SIZE = 4.5 * 1024 * 1024; // 4.5MB
  if (file.size > MAX_SIZE) {
    throw new Error("File too large (max 4.5MB)");
  }

  try {
    // Convert to WebP
    const webpBlob = await convertToWebP(file);

    // Validate converted size
    if (webpBlob.size > MAX_SIZE) {
      throw new Error("Converted file too large (max 4.5MB)");
    }

    const timestamp = Date.now();
    const filename = `uploads/${timestamp}-${file.name}`;

    const blob = await put(filename, webpBlob, { access: "public" });

    return blob.url;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Upload error:", err);
    throw new Error(`Upload failed: ${err.message}`);
  }
}

async function convertToWebP(file: File, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Failed to get canvas context"));

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to convert to WebP"));
        },
        "image/webp",
        quality
      );
    };

    img.onerror = (err) => reject(err);
    img.src = url;
  });
}


export async function deleteImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return;

  try {
    await del(imageUrl);
  } catch (err) {
    console.error("Delete error:", err);
  }
}
