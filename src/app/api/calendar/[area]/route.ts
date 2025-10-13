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
import { generateSlots } from "@/lib/util";
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
            });

            const daySlots = generateSlots("08:00", "21:00"); // baseline slots

            const spacesWithSlots = spaces.map((space: ISpace) => {
                const spaceBookings = bookings.filter(
                    (b) => b.space.toString() === space.id
                );

                const slotStatuses: Record<string, "available" | "unavailable"> = {};
                const booked = new Set(
                    spaceBookings.flatMap((b) => b.times) // <-- using the times field
                );

                daySlots.forEach((slot) => {
                    slotStatuses[slot] = booked.has(slot) ? "unavailable" : "available";
                });

                return {
                    id: space.id,
                    name: space.name,
                    slots: slotStatuses,
                };
            });

            return APIResponse.success("fetched day view", {
                date: format(date, "yyyy-MM-dd"),
                spaces: spacesWithSlots,
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

            const fullDaySlots = generateSlots("00:00", "23:00");

            const days: {
                date: string;
                status: "available" | "partial" | "unavailable";
                totalBookings: number;
            }[] = [];

            for (let d = start; d <= end; d = addDays(d, 1)) {
                const dateStr = format(d, "yyyy-MM-dd");

                // ✅ Just filter the pre-fetched bookings for this day
                const dayBookings = bookings.filter(
                    (b) => format(b.eventDate, "yyyy-MM-dd") === dateStr
                );

                const statuses = spaces.map((space: ISpace) => {
                    const spaceBookings = dayBookings.filter(
                        (b) => b.space.toString() === space.id
                    );

                    if (spaceBookings.length === 0) return "available";

                    const booked = new Set(spaceBookings.flatMap((b) => b.times));

                    const isFullyBooked = fullDaySlots.every((slot) => booked.has(slot));

                    if (isFullyBooked) return "unavailable";
                    return "partial";
                });

                let overall: "available" | "partial" | "unavailable" = "partial";
                if (statuses.every((s) => s === "available")) overall = "available";
                else if (statuses.every((s) => s === "unavailable")) overall = "unavailable";

                // ✅ Already have dayBookings, no need for another DB query
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
