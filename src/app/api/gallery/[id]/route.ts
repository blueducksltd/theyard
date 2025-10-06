import APIResponse from "@/lib/APIResponse";
import { requireAuth } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Event from "@/models/Event";
import Gallery from "@/models/Gallery";
import { IGallery, sanitizeGallery, UpdateGalleryDTO, UpdateGalleryInput } from "@/types/Gallery";
import { NextRequest } from "next/server";

export const PUT = errorHandler<{ params: { id: string } }>(
    async (request: NextRequest, context) => {
        await connectDB();

        // Authenticate user
        requireAuth(request);

        const { id } = await context.params;
        const body: UpdateGalleryInput = await request.json();

        // Validate incoming data
        const data = UpdateGalleryDTO.parse(body);

        // Find the main gallery by id
        const gallery = await Gallery.findById(id);
        if (!gallery) throw APIError.NotFound(`Gallery with id: ${id} not found`);

        // Find all galleries with the same title
        const relatedGalleries = await Gallery.find({ title: gallery.title });

        if (relatedGalleries.length === 0)
            throw APIError.NotFound(`No galleries found with title: ${gallery.title}`);

        // Update all related galleries with the new data
        await Gallery.updateMany({ title: gallery.title }, { $set: data });

        // Fetch the updated ones to return
        const title = data.title || gallery.title;
        const updatedGalleries = await Gallery.find({ title });
        const sanitizedGallery = updatedGalleries.map((image: IGallery) => sanitizeGallery(image));

        return APIResponse.success(
            `Updated ${updatedGalleries.length} gallery item(s) with title '${title}'`,
            { galleries: sanitizedGallery },
            200
        );
    }
);


export const DELETE = errorHandler<{ params: { id: string } }>(
    async (request: NextRequest, context) => {
        await connectDB();

        requireAuth(request);
        const { id } = await context.params;

        const imageExist = await Gallery.findById(id);
        if (!imageExist) throw APIError.NotFound(`Image with id: ${id} not found`);

        // Remove the gallery id from the event's images array if event exists
        if (imageExist.event) {
            await Event.findByIdAndUpdate(
                imageExist.event,
                { $pull: { images: imageExist.id } }
            )
        }

        // Delete the gallery image
        await deleteFromCloudinary(imageExist.imageUrl)
        await Gallery.findByIdAndDelete(id);

        return APIResponse.success(`Image with id ${id} removed`, undefined);
    }
)

export const GET = errorHandler<{ params: { id: string } }>(
    async (request: NextRequest, context) => {
        await connectDB();

        requireAuth(request);
        const { id } = await context.params;

        const imageExist = await Gallery.findById(id);
        if (!imageExist) throw APIError.NotFound(`Image with id: ${id} not found`);

        return APIResponse.success("fetched single gallery", { gallery: sanitizeGallery(imageExist) });
    }
);