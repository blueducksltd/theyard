import { v2 as cloudinary } from "cloudinary";
import APIError, { ErrorDetails } from "./errors/APIError";

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteFromCloudinary(imageUrl: string) {
  if (!imageUrl) return;
  try {
    const matches = imageUrl.match(/\/upload\/(.+)\.[a-zA-Z0-9]+$/);
    if (!matches || !matches[1]) throw new Error("Invalid Cloudinary URL");
    const publicId = matches[1];
    const { v2: cloudinary } = await import("cloudinary");
    return await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary Delete Error:", err);
    throw APIError.Internal("Failed to delete image from Cloudinary");
  }
}

export async function uploadToCloudinary(file: File): Promise<string> {
  // Debug logging
  console.log("🔍 Cloudinary Config Check:");
  console.log(
    "Cloud Name:",
    process.env.CLOUDINARY_CLOUD_NAME ? "SET" : "MISSING",
  );
  console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "SET" : "MISSING");
  console.log(
    "API Secret:",
    process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING",
  );
  console.log("Folder:", process.env.CLOUDINARY_FOLDER || "not set");

  // Validate credentials exist
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary credentials are not configured");
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: process.env.CLOUDINARY_FOLDER || "uploads",
          format: "webp",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("⚠️ Cloudinary Upload Error:", {
              message: error.message,
              http_code: error.http_code,
              // Log if there's an error property with more details
              error: error.error,
            });
            return reject(error);
          }
          resolve(result?.secure_url as string);
        },
      );
      stream.end(buffer);
    });
  } catch (err) {
    console.error("⚠️ UploadToCloudinary Error:", err);
    throw new Error("Failed to upload image to Cloudinary");
  }
}
