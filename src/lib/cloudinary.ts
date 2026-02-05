import { v2 as cloudinary } from "cloudinary";
import APIError from "./errors/APIError";

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

function getCloudinaryConfig() {
  return {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  };
}

export async function uploadToCloudinary(file: File): Promise<string> {
  // Configure inside function
  const config = getCloudinaryConfig();
  cloudinary.config(config);

  // Detailed logging
  console.log("🔍 Attempting Cloudinary upload with config:");
  console.log(
    "Cloud Name:",
    config.cloud_name ? `${config.cloud_name.substring(0, 5)}...` : "MISSING",
  );
  console.log(
    "API Key:",
    config.api_key ? `${config.api_key.substring(0, 5)}...` : "MISSING",
  );
  console.log("API Secret:", config.api_secret ? "SET" : "MISSING");

  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    throw new Error("Missing Cloudinary credentials");
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("📦 File buffer size:", buffer.length);

    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: process.env.CLOUDINARY_FOLDER || "uploads",
        resource_type: "auto" as const,
        format: "webp",
      };

      console.log("⬆️ Starting upload with options:", uploadOptions);

      const stream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary Upload Error:", {
              message: error.message,
              name: error.name,
              http_code: error.http_code,
              fullError: JSON.stringify(error, null, 2),
            });
            return reject(error);
          }

          if (!result?.secure_url) {
            console.error("❌ No secure_url in result");
            return reject(new Error("No URL returned from Cloudinary"));
          }

          console.log("✅ Upload successful:", result.secure_url);
          resolve(result.secure_url);
        },
      );

      stream.end(buffer);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("❌ Upload function error:", {
      message: err?.message,
      stack: err?.stack,
      fullError: JSON.stringify(err, null, 2),
    });
    throw new Error(
      `Failed to upload image: ${err?.message || "Unknown error"}`,
    );
  }
}
