import { NextRequest } from "next/server";
import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Gallery from "@/models/Gallery";
import { CreateGalleryDTO, CreateGalleryInput } from "@/types/Gallery";
import Event from "@/models/Event";


export const POST = errorHandler(async (request: NextRequest) => {
    await connectDB();
    const payload = requireAuth(request);

    if (!requireRole(payload, "admin", "manager")) {
        throw APIError.Forbidden("No permission to access this endpoint");
    }

    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
        throw APIError.BadRequest("Content-Type must be multipart/form-data");
    }

    const form = await request.formData();
    const images = form.getAll("images") as File[];
    console.log({ form })

    if (images.length === 0) {
        throw APIError.BadRequest("No images provided");
    }

    const body: Partial<CreateGalleryInput> = {
        title: form.get("title") as CreateGalleryInput["title"],
        category: form.get("category") as CreateGalleryInput["category"],
        description: form.get("description") as CreateGalleryInput["description"] || undefined,
        eventId: form.get("eventId") as CreateGalleryInput["eventId"] || undefined,
        imageUrl: undefined // will be set after upload
    };

    // Upload + create each gallery document concurrently
    const galleries = await Promise.all(
        images.map(async (image) => {
            const imageUrl = await uploadToCloudinary(image);
            body.imageUrl = imageUrl;
            // Validate & coerce with Zod
            const data = CreateGalleryDTO.parse(body);

            const gallery = await Gallery.create({
                title: data.title,
                category: data.category,
                description: data.description,
                event: data.eventId,
                imageUrl: data.imageUrl,
            });

            // If eventId provided, push gallery.id into Event.gallery
            if (gallery.event) {
                await Event.findByIdAndUpdate(
                    data.eventId,
                    { $push: { gallery: gallery.id } },
                    { new: true }
                );
            }

            return gallery;

        })
    );

    const sanitizedGalleries = galleries.map(gallery => ({
        id: gallery.id,
        title: gallery.title,
        category: gallery.category,
        description: gallery.description,
        imageUrl: gallery.imageUrl,
        event: gallery.event
    }));

    return APIResponse.success(
        `${galleries.length} new image(s) added successfully`,
        { gallery: sanitizedGalleries },
        201
    );
});

export const GET = errorHandler(async (request: NextRequest) => {
    await connectDB();

    // Check if user is admin (optional auth)
    const authHeader = request.headers.get("authorization");
    let isAdmin = false;
    if (authHeader) {
        const payload = requireAuth(request);
        if (payload) isAdmin = true;
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") ?? "createdAt";
    const direction = (searchParams.get("direction") as "ASC" | "DESC") ?? "ASC";
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "10", 10);

    const filter: Record<string, string> = {};
    if (category) filter.category = category;

    const gallery = await Gallery.filter(filter, sort, direction, isAdmin);
    if (!gallery || gallery.length === 0) {
        return APIResponse.success("No gallery found", { gallery: [] }, 200);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedGallery = gallery.slice(startIndex, endIndex);

    const pagination = {
        currentPage: page,
        totalPages: Math.ceil(gallery.length / limit),
        pageSize: limit,
        totalItems: gallery.length,
        nextPage: endIndex < gallery.length ? page + 1 : null,
        prevPage: startIndex > 0 ? page - 1 : null,
    };

    return APIResponse.success(
        "Gallery retrieved successfully",
        { gallery: paginatedGallery, pagination },
        200
    );
});
