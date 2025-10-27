import { put } from "@vercel/blob";

export async function uploadImage(file: File): Promise<string> {
  const blob = await put(file.name, file, {
    access: "public",
  });

  return blob.url;
}
