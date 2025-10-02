import APIResponse from "@/lib/APIResponse";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Event from "@/models/Event";
import { sanitizeEvent } from "@/types/Event";
import { NextRequest } from "next/server";

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
        const type = searchParams.get("type");
        const status = searchParams.get("status");
        const sort = searchParams.get("sort") || "date";
        const direction = (searchParams.get("direction") as "ASC" | "DESC") || "ASC";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        const filter = {};
        if (type) Object.assign(filter, { type });
        if (status) Object.assign(filter, { status });

        const events = await Event.filter(filter, sort, direction, admin);
        if (!events) throw APIError.NotFound("No events found");
        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedEvents = events.slice(startIndex, endIndex);

        if (paginatedEvents.length === 0) return APIResponse.success("No events found", { events: [] });

        const sanitizedEvents = paginatedEvents.map(event => sanitizeEvent(event));

        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(events.length / limit),
            pageSize: limit,
            totalItems: events.length,
            nextPage: endIndex < events.length ? page + 1 : null,
            prevPage: startIndex > 0 ? page - 1 : null
        }
        return APIResponse.success("Events retrieved successfully", { events: sanitizedEvents, pagination });
    }
);