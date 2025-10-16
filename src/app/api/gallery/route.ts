import { NextRequest } from "next/server";
import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Gallery from "@/models/Gallery";
import { CreateGalleryDTO, CreateGalleryInput, sanitizeGallery } from "@/types/Gallery";
import Event from "@/models/Event";
import Tag from "@/models/Tag";


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

    if (images.length === 0) {
        throw APIError.BadRequest("No images provided");
    }

    if (images.length > 5) {
        throw APIError.BadRequest("You can only upload a maximum of 5 images at once");
    }

    const body: Partial<CreateGalleryInput> = {
        title: form.get("title") as CreateGalleryInput["title"],
        category: form.get("category") as CreateGalleryInput["category"],
        description: form.get("description") as CreateGalleryInput["description"] || undefined,
        eventId: form.get("eventId") as CreateGalleryInput["eventId"] || undefined,
        imageUrl: undefined, // will be set after upload
        mediaDate: form.get("mediaDate") ? new Date(form.get("mediaDate") as string) : undefined
    };

    const validTag = await Tag.findOne({ name: body.category });

    if (!validTag) {
        throw APIError.BadRequest("Invalid category", {
            message: `The provided category '${body.category}' does not exist in the list of valid tags.`,
            field: "category",
            expected: "One of the existing tag names"
        });
    }

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
                mediaDate: data.mediaDate
            });

            // If eventId provided, push gallery.id into Event.gallery
            if (gallery.event) {
                await Event.findByIdAndUpdate(
                    data.eventId,
                    { $push: { images: imageUrl } },
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
        event: gallery.event,
        mediaDate: gallery.mediaDate
    }));

    return APIResponse.success(
        `${galleries.length} new image(s) added successfully`,
        { gallery: sanitizedGalleries },
        201
    );
});

export const GET = errorHandler(async (request: NextRequest) => {
    await connectDB();

    // --- Query params ---
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const mediaDate = searchParams.get("mediadate");
    const sort = searchParams.get("sort") ?? "createdAt";
    const direction = (searchParams.get("direction") as "ASC" | "DESC") ?? "ASC";
    const page = parseInt(searchParams.get("page") ?? "1", 10);

    // Handle limit (optional)
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : null;

    // --- Build filter ---
    const filter: Record<string, string> = {};
    if (category) filter.category = category;
    if (mediaDate) filter.mediaDate = mediaDate;

    // --- Fetch gallery items ---
    const gallery = await Gallery.filter(filter, sort, direction);
    if (!gallery || gallery.length === 0) {
        return APIResponse.success("No gallery found", { gallery: [] }, 200);
    }

    // --- Pagination ---
    let paginatedGallery = gallery;
    let pagination = undefined;

    if (limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        paginatedGallery = gallery.slice(startIndex, endIndex);

        pagination = {
            currentPage: page,
            totalPages: Math.ceil(gallery.length / limit),
            pageSize: limit,
            totalItems: gallery.length,
            nextPage: endIndex < gallery.length ? page + 1 : null,
            prevPage: startIndex > 0 ? page - 1 : null,
        };
    }

    // --- Sanitize ---
    const sanitizedGallery = paginatedGallery.map((image) => sanitizeGallery(image));

    // --- Respond ---
    return APIResponse.success(
        "Gallery retrieved successfully",
        { gallery: sanitizedGallery, pagination },
        200
    );
});
