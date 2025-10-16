import APIResponse from "@/lib/APIResponse";
import { connectDB } from "@/lib/db";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Event from "@/models/Event";
import { sanitizeEvent } from "@/types/Event";
import { NextRequest } from "next/server";

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
