// app/api/calendar/[area]/route.ts
import { NextRequest } from "next/server";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import APIResponse from "@/lib/APIResponse";
import Booking from "@/models/Booking";
import Space from "@/models/Space";
import {
    startOfDay,
    endOfDay,
    startOfMonth,
    endOfMonth,
    addDays,
    format,
    // addHours,
} from "date-fns";
import { generateTimeSlots, toMinutes } from "@/lib/util";
import { connectDB } from "@/lib/db";



export const GET = errorHandler(
    async (request: NextRequest, context: { params: { area: string } }) => {
        const area = await context.params.area;
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

            const slots = generateTimeSlots(); // ["08:00", ..., "20:00"]

            const spacesWithSlots = spaces.map((space) => {
                const spaceBookings = bookings.filter(
                    (b) => b.space.toString() === space.id
                );

                const slotStatuses: Record<string, "available" | "booked"> = {};

                slots.forEach((slot) => {
                    const [hour, minute] = slot.split(":").map(Number);
                    const slotTime = new Date(date);
                    slotTime.setHours(hour, minute, 0, 0);

                    const isBooked = spaceBookings.some((b) => {
                        const bookingStart = toMinutes(b.startTime);
                        const bookingEnd = toMinutes(b.endTime);
                        const slotMinutes = toMinutes(slot);

                        // Include the end boundary if you want the last slot blocked
                        return slotMinutes >= bookingStart && slotMinutes <= bookingEnd;
                    });


                    slotStatuses[slot] = isBooked ? "booked" : "available";
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
            const bookings = await Booking.find({
                eventDate: { $gte: start, $lte: end },
            });

            const days: { date: string; status: "available" | "partial" | "unavailable" }[] = [];

            for (let d = start; d <= end; d = addDays(d, 1)) {
                const dateStr = format(d, "yyyy-MM-dd");
                // const dayStart = startOfDay(d);
                // const dayEnd = endOfDay(d);

                const dayBookings = bookings.filter(
                    (b) => format(b.eventDate, "yyyy-MM-dd") === dateStr
                );

                const statuses = spaces.map((space) => {
                    const spaceBookings = dayBookings.filter(
                        (b) => b.space.toString() === space.id
                    );

                    if (spaceBookings.length === 0) return "available";

                    // Check if fully booked (covers entire 8–20 range)
                    const fullyBooked = spaceBookings.some((b) => {
                        return b.startTime === "08:00" && b.endTime === "20:00";
                    });

                    if (fullyBooked) return "unavailable";
                    return "partial";
                });

                let overall: "available" | "partial" | "unavailable" = "partial";
                if (statuses.every((s) => s === "available")) overall = "available";
                else if (statuses.every((s) => s === "unavailable")) overall = "unavailable";

                days.push({ date: dateStr, status: overall });
            }

            return APIResponse.success("fetched month view", {
                month: format(targetMonth, "MMMM yyyy"),
                days,
            });
        }

        throw new Error("Invalid area. Must be 'days' or 'months'");
    }
);
