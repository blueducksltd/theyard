import APIResponse from "@/lib/APIResponse";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Space from "@/models/Space";
import Booking from "@/models/Booking";
import {
    startOfDay,
    endOfDay,
    startOfMonth,
    endOfMonth,
    addDays,
    format,
} from "date-fns";
import { ISpace } from "@/types/Space";

export const GET = errorHandler<{ params: { area: string } }>(

    async (request: NextRequest, context) => {
        const { area } = await context.params;
        const { searchParams } = new URL(request.url);
        await connectDB();

        // ---------------------
        // DAY VIEW
        // ---------------------
        if (area === "days") {
            const dateParam = searchParams.get("date");
            if (!dateParam) throw new Error("Missing date parameter (YYYY-MM-DD)");

            const date = new Date(dateParam);
            const dayStart = startOfDay(date);
            const dayEnd = endOfDay(date);

            const spaces = await Space.find();
            const bookings = await Booking.find({
                eventDate: { $gte: dayStart, $lte: dayEnd },
                status: { $ne: "cancelled" }
            });

            // Day-based availability - a space is either available or unavailable for the whole day
            const spacesWithAvailability = spaces.map((space: ISpace) => {
                const isBooked = bookings.some(
                    (b) => b.space.toString() === space.id
                );

                return {
                    id: space.id,
                    name: space.name,
                    status: isBooked ? "unavailable" : "available",
                };
            });

            return APIResponse.success("fetched day view", {
                date: format(date, "yyyy-MM-dd"),
                spaces: spacesWithAvailability,
            });
        }

        // ---------------------
        // MONTH VIEW
        // ---------------------
        if (area === "months") {
            const monthParam = searchParams.get("month"); // e.g. "2025-09"
            if (!monthParam) throw new Error("Missing month query (YYYY-MM)");

            const [year, month] = monthParam.split("-").map(Number);
            const targetMonth = new Date(year, month - 1, 1);

            const start = startOfMonth(targetMonth);
            const end = endOfMonth(targetMonth);

            const spaces = await Space.find();
            const bookings = await Booking.findByDateRange(start, end);

            const days: {
                date: string;
                status: "available" | "partial" | "unavailable";
                totalBookings: number;
            }[] = [];

            for (let d = start; d <= end; d = addDays(d, 1)) {
                const dateStr = format(d, "yyyy-MM-dd");

                // Filter the pre-fetched bookings for this day
                const dayBookings = bookings.filter(
                    (b) => format(b.eventDate, "yyyy-MM-dd") === dateStr
                );

                // Check each space's availability for this day
                // A space is "unavailable" if it has any booking for this day
                // A space is "available" if it has no bookings for this day
                const statuses = spaces.map((space: ISpace) => {
                    const spaceBookings = dayBookings.filter(
                        (b) => b.space.toString() === space.id
                    );

                    // Day-based: if any booking exists, space is unavailable for the whole day
                    return spaceBookings.length > 0 ? "unavailable" : "available";
                });

                // Determine overall day status
                let overall: "available" | "partial" | "unavailable" = "available";

                const hasBookedSpaces = statuses.some((s) => s === "unavailable");
                const hasAvailableSpaces = statuses.some((s) => s === "available");

                if (hasBookedSpaces && hasAvailableSpaces) {
                    overall = "partial"; // Some spaces booked, some available
                } else if (hasBookedSpaces && !hasAvailableSpaces) {
                    overall = "unavailable"; // All spaces booked
                }
                // If no booked spaces, remains "available"

                days.push({
                    date: dateStr,
                    status: overall,
                    totalBookings: dayBookings.length,
                });
            }

            return APIResponse.success("fetched month view", {
                month: format(targetMonth, "MMMM yyyy"),
                days,
            });
        }


        throw new Error("Invalid area. Must be 'days' or 'months'");
    }
);
