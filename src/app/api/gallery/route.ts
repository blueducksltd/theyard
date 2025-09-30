import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Gallery from "@/models/Gallery";
import { CreateGalleryDTO } from "@/types/Gallery";
import { NextRequest } from "next/server";

export const POST = errorHandler(async (request: NextRequest) => {
    await connectDB();
    const payload = requireAuth(request);

    if (!requireRole(payload, "admin", "manager")) {
        throw APIError.Forbidden("No permission to access this endpoint");
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
        throw APIError.BadRequest("Content-Type must be multipart/form-data");
    }

    const form = await request.formData();
    const files: File[] = [];
    const body: Record<string, any> = {};

    // Separate files from other fields
    form.forEach((value, key) => {
        if (key === "images" && value instanceof File) {
            files.push(value);
        } else {
            body[key] = value;
        }
    });

    if (files.length === 0) {
        throw APIError.BadRequest("At least one image is required");
    }

    // Process uploads + inserts concurrently
    const galleries = await Promise.all(
        files.map(async (file) => {
            const imageUrl = await uploadToCloudinary(file);
            const data = CreateGalleryDTO.parse({ ...body, imageUrl });
            return Gallery.create(data);
        })
    );

    return APIResponse.success(
        `${galleries.length} new image(s) added successfully`,
        { galleries },
        201
    );
});


export const GET = errorHandler(
    async (request: NextRequest) => {
        await connectDB();
        const authHeader = request.headers.get("authorization");
        let admin = false;
        if (authHeader) {
            const payload = requireAuth(request);
            // Role is not required, just checking if admin to show all events
            if (payload) admin = true;
        }

        // check query params
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const sort = searchParams.get("sort") || "createdAt";
        const direction = (searchParams.get("direction") as "ASC" | "DESC") || "ASC";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        const filter = {};
        if (category) Object.assign(filter, { category });
        const gallery = await Gallery.filter(filter, sort, direction, admin);
        if (!gallery) throw APIError.NotFound("No gallery found");

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedgallery = gallery.slice(startIndex, endIndex);
        if (paginatedgallery.length === 0) return APIResponse.success("No gallery found", { gallery: [] });

        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(gallery.length / limit),
            pageSize: limit,
            totalItems: gallery.length,
            nextPage: endIndex < gallery.length ? page + 1 : null,
            prevPage: startIndex > 0 ? page - 1 : null
        }

        return APIResponse.success("gallery retrieved successfully", { gallery: paginatedgallery, pagination });
    }
);