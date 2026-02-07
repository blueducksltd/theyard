import APIResponse from "@/lib/APIResponse";
import { connectDB } from "@/lib/db";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import APIError from "@/lib/errors/APIError";
import { requireAuth, requireRole } from "@/lib/auth";
import { uploadImage } from "@/lib/vercel";
import Event from "@/models/Event";
import Customer from "@/models/Customer";
import { sanitizeEvent } from "@/types/Event";
import { NextRequest } from "next/server";
import { Types } from "mongoose";
import z from "zod";

export const GET = errorHandler(async (request: NextRequest) => {
    await connectDB();

    // --- Query params ---
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const sort = searchParams.get("sort") || "date";
    const direction = (searchParams.get("direction") as "ASC" | "DESC") || "ASC";
    const page = parseInt(searchParams.get("page") || "1", 10);

    // Handle limit (optional)
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : null;

    // --- Filter logic ---
    const filter = {};
    if (type) Object.assign(filter, { type });
    if (status) Object.assign(filter, { status });

    // --- Fetch events ---
    const events = await Event.filter(filter, sort, direction);
    if (!events || events.length === 0)
        return APIResponse.success("No events found", { events: [] });

    // --- Pagination ---
    let paginatedEvents = events;
    let pagination = undefined;

    if (limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        paginatedEvents = events.slice(startIndex, endIndex);

        pagination = {
            currentPage: page,
            totalPages: Math.ceil(events.length / limit),
            pageSize: limit,
            totalItems: events.length,
            nextPage: endIndex < events.length ? page + 1 : null,
            prevPage: startIndex > 0 ? page - 1 : null,
        };
    }

    // --- Sanitize ---
    const sanitizedEvents = paginatedEvents.map((event) => sanitizeEvent(event));

    // --- Response ---
    return APIResponse.success("Events retrieved successfully", {
        events: sanitizedEvents,
        pagination,
    });
});

// DTO defined inline (matching the pattern from package route)
const CreateEventDTO = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    date: z
        .string()
        .refine(
            (val) => {
                // Accept multiple date formats
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
            "Invalid date format. Use YYYY-MM-DD, ISO 8601, MM/DD/YYYY, or DD.MM.YYYY",
        ),
    // startTime: z.string().min(1, "Start time is required"),
    // endTime: z.string().min(1, "End time is required"),
    location: z.string().min(1, "Location is required"),
    public: z.boolean().optional().default(false),
    images: z.array(z.string()).optional(),
});

type CreateEventInput = z.infer<typeof CreateEventDTO>;

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

    if (images.length > 5) {
        throw APIError.BadRequest(
            "You can only upload a maximum of 5 images at once",
        );
    }

    const _public = form.get("public") === "true";

    // Upload images
    const imageUrls = await Promise.all(
        images.map(async (image) => {
            const imageUrl = await uploadImage(image);
            return imageUrl;
        }),
    );

    // Get form data
    const body: CreateEventInput = {
        title: form.get("title") as string,
        description: form.get("description") as string,
        date: form.get("date") as CreateEventInput["date"],
        // startTime: form.get("startTime") as string,
        // endTime: form.get("endTime") as string,
        location: form.get("location") as string,
        public: _public,
        images: imageUrls,
    };

    // Validate with Zod
    const data = CreateEventDTO.parse(body);

    // Generate slug
    const slug = data.title
        .trim()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

    if (await Event.findOne({ slug })) throw APIError.Conflict("Event with slug exist, change title");
    // Get customerId from form (optional)
    const customerId = form.get("customerId") as string;
    let customer: Types.ObjectId;

    if (customerId) {
        const foundCustomer = await Customer.findById(customerId);
        if (!foundCustomer) {
            throw APIError.NotFound("Customer not found");
        }
        customer = foundCustomer._id as Types.ObjectId;
    } else {
        // Create placeholder customer for admin events
        const placeholderCustomer = await Customer.create({
            firstname: "Admin",
            lastname: "Event",
            email: `admin-event-${Date.now()}@placeholder.com`,
            phone: "0000000000",
        });
        customer = placeholderCustomer._id as Types.ObjectId;
    }

    // Create event
    const event = await Event.create({
        title: data.title,
        slug,
        description: data.description || "",
        customer,
        images: data.images || [],
        public: data.public,
        date: new Date(data.date),
        time: { start: "09:00", end: "18:00" }, // Default day hours
        status: "pending",
        location: data.location,
    });

    await event.populate("customer");

    return APIResponse.success(
        "Event created successfully",
        { event: sanitizeEvent(event) },
        201,
    );
});
