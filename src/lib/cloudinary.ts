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
        throw new APIError(500, "Failed to delete image from Cloudinary", err as ErrorDetails);
    }
}

export async function uploadToCloudinary(file: File): Promise<string> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: process.env.CLOUDINARY_FOLDER, format: "webp" },
                (error, result) => {
                    if (error) {
                        // Log entire error object including HTML responses
                        console.error("⚠️ Cloudinary Upload Error:");
                        console.error("Type:", typeof error);
                        console.error("Raw:", error);
                        console.error("Stringified:", JSON.stringify(error, null, 2));
                        return reject(error);
                    }
                    resolve(result?.secure_url as string);
                }
            );
            stream.end(buffer);
        });
    } catch (err) {
        // Catch network or runtime errors (like HTML response)
        console.error("⚠️ UploadToCloudinary Error (outer catch):");
        console.error("Stringified:", JSON.stringify(err, null, 2));

        // Return API-friendly error, but keep the raw error logged
        throw new APIError(500, "Failed to upload image to Cloudinary");
    }
}