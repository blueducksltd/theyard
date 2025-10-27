import { v2 as cloudinary } from "cloudinary";
import APIError, { ErrorDetails } from "./errors/APIError";

/**
 * Deletes an image from Cloudinary given its URL.
 * @param imageUrl The full URL of the image to delete.
 * @returns The result of the Cloudinary destroy operation.
 */
export async function deleteFromCloudinary(imageUrl: string) {
    if (!imageUrl) return;
    try {
        const matches = imageUrl.match(/\/upload\/(.+)\.[a-zA-Z0-9]+$/);
        if (!matches || !matches[1]) throw new Error("Invalid Cloudinary URL");
        const publicId = matches[1];
        const { v2: cloudinary } = await import("cloudinary");
        return await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        return new APIError(500, "Failed to delete image from Cloudinary: ", (err as ErrorDetails));
    }
}


// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file: File): Promise<string | APIError> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: process.env.CLOUDINARY_FOLDER, format: "webp" },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result?.secure_url as string);
                }
            );
            stream.end(buffer);
        });
    } catch (err) {
        return new APIError(500, "Failed to upload image to Cloudinary: ", (err as ErrorDetails));
    }
}
