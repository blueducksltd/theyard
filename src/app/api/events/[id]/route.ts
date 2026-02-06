import APIResponse from "@/lib/APIResponse";
// import { requireAuth } from "@/lib/auth";
// import { deleteFromCloudinary } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Event from "@/models/Event";
import { sanitizeEvent } from "@/types/Event";
import { NextRequest } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { uploadImage } from "@/lib/vercel";
import { z } from "zod";

// ... existing imports ...

// DELETE Handler
export const DELETE = errorHandler<{ params: { id: string } }>(
    async (request: NextRequest, context) => {
        await connectDB();
        const payload = requireAuth(request);
        requireRole(payload, "admin", "manager");

        let { id: slug } = await context.params;
        slug = decodeURIComponent(slug.trim());

        const event = await Event.findOne({ slug });
        if (!event) throw APIError.NotFound(`Event with slug: ${slug} not found`);

        // Delete images from Cloudinary
        if (event.images && event.images.length > 0) {
            await Promise.all(
                event.images.map((imageUrl) => deleteFromCloudinary(imageUrl))
            );
        }

        await Event.deleteOne({ slug });

        return APIResponse.success("Event deleted successfully", { slug });
    }
);

// PUT Handler (update event - NO time editing)
const UpdateEventDTO = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    date: z
        .string()
        .refine(
            (val) => {
                const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
                const standardRegex = /^\d{4}-\d{2}-\d{2}$/;
                const usRegex = /^\d{2}\/\d{2}\/\d{4}$/;
                const euRegex = /^\d{2}\.\d{2}\.\d{4}$/;
                return (
                    isoRegex.test(val) ||
                    standardRegex.test(val) ||
                    usRegex.test(val) ||
                    euRegex.test(val)
                );
            },
            "Invalid date format"
        )
        .optional(),
    location: z.string().min(1, "Location is required").optional(),
    public: z.boolean().optional(),
    status: z.enum(["active", "completed", "cancelled", "pending"]),
    images: z.array(z.string()).optional(),
});

type UpdateEventInput = z.infer<typeof UpdateEventDTO>;

export const PUT = errorHandler<{ params: { id: string } }>(
    async (request: NextRequest, context) => {
        await connectDB();
        const payload = requireAuth(request);
        requireRole(payload, "admin", "manager");

        const contentType = request.headers.get("content-type") ?? "";
        let { id: slug } = await context.params;
        slug = decodeURIComponent(slug.trim());

        const event = await Event.findOne({ slug });
        if (!event) throw APIError.NotFound(`Event with slug: ${slug} not found`);

        let body: UpdateEventInput;

        if (contentType.includes("multipart/form-data")) {
            const form = await request.formData();
            const images = form.getAll("images") as File[];
            const imageUrls = await Promise.all(
                images.map((image) => uploadImage(image))
            );

            const publicRaw = form.get("public");

            body = {
                status: form.get("status") as UpdateEventInput["status"] || undefined,
                title: form.get("title") as UpdateEventInput["title"] || undefined,
                description: form.get("description") as UpdateEventInput["description"] || undefined,
                date: form.get("date") as UpdateEventInput["date"] || undefined,
                location: form.get("location") as UpdateEventInput["location"] || undefined,
                public: publicRaw === null ? undefined : publicRaw === "true",
                images: imageUrls.length > 0 ? imageUrls : undefined,
            };
        } else {
            body = await request.json();
        }

        const data = UpdateEventDTO.parse(body);

        // Generate new slug if title changed
        let newSlug = slug;
        if (data.title) {
            newSlug = data.title
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")

            if (await Event.findOne({ slug })) throw APIError.Conflict("Event with slug exist, change title");
        }

        // Update event (time remains unchanged with defaults)
        const updatedEvent = await Event.findOneAndUpdate(
            { slug },
            {
                title: data.title,
                slug: newSlug,
                description: data.description ?? event.description,
                date: data.date ? new Date(data.date) : event.date,
                location: data.location,
                public: data.public ?? event.public,
                images: data.images ?? event.images,
                // time field not included - keeps existing/default values
            },
            { new: true }
        );

        if (!updatedEvent) throw APIError.NotFound("Event not found");

        await updatedEvent.populate("customer");

        return APIResponse.success("Event updated successfully", {
            event: sanitizeEvent(updatedEvent),
        });
    }
);

export const GET = errorHandler<{ params: { id: string } }>(
    async (__request: NextRequest, context) => {
        await connectDB();

        // requireAuth(request);
        let { id: slug } = await context.params;
        // remove start and end spaces

        slug = decodeURIComponent(slug.trim());


        const eventExist = await Event.findOne({ slug })
            .populate("customer")
        if (!eventExist) throw APIError.NotFound(`event with slug: ${slug} not found`);

        return APIResponse.success("fetched single event", { event: sanitizeEvent(eventExist) });
    }
);