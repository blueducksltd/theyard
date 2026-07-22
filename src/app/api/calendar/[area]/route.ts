import APIResponse from "@/lib/APIResponse";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Space from "@/models/Space";
import Booking from "@/models/Booking";
import ClosedDay from "@/models/ClosedDay";
import { isShutdownPackage } from "@/lib/packageRules";
import {
    startOfDay,
    endOfDay,
    startOfMonth,
    endOfMonth,
    addDays,
    format,
    isValid,
    parse,
} from "date-fns";
import { ISpace } from "@/types/Space";

const DAY_SLOT_START = "09:00";
const DAY_SLOT_END = "18:00";

function parseCalendarDate(dateParam: string): Date {
    const parsedDate = parse(dateParam, "yyyy-MM-dd", new Date());

    if (!isValid(parsedDate)) {
        throw new Error("Invalid date parameter (YYYY-MM-DD)");
    }

    return parsedDate;
}

function normalizeBookingTime(time?: string | null): string | null {
    if (!time) return null;

    const trimmedTime = time.trim();
    const twentyFourHourMatch = trimmedTime.match(/^(\d{1,2}):(\d{2})$/);
    if (twentyFourHourMatch) {
        const hours = Number(twentyFourHourMatch[1]);
        const minutes = Number(twentyFourHourMatch[2]);

        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
            return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        }
    }

    const meridiemMatch = trimmedTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!meridiemMatch) return null;

    let hours = Number(meridiemMatch[1]);
    const minutes = Number(meridiemMatch[2]);
    const meridiem = meridiemMatch[3].toUpperCase();

    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
        return null;
    }

    if (meridiem === "AM") {
        hours = hours === 12 ? 0 : hours;
    } else if (hours !== 12) {
        hours += 12;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

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

            const date = parseCalendarDate(dateParam);
            const dayStart = startOfDay(date);
            const dayEnd = endOfDay(date);
            const slotTimes = Array.from({ length: Number(DAY_SLOT_END.slice(0, 2)) - Number(DAY_SLOT_START.slice(0, 2)) + 1 }, (_, index) => {
                const hour = Number(DAY_SLOT_START.slice(0, 2)) + index;
                return `${String(hour).padStart(2, "0")}:00`;
            });

            const spaces = await Space.find();
            const bookings = await Booking.find({
                eventDate: { $gte: dayStart, $lte: dayEnd },
                status: { $ne: "cancelled" }
            })
                .populate("package")
                .populate("customer")
                .populate("event");
            const manuallyClosedDay = await ClosedDay.findOne({
                date: { $gte: dayStart, $lte: dayEnd },
            });

            const hasShutdownBooking = bookings.some((booking) =>
                isShutdownPackage(booking.package as unknown as { name?: string; description?: string; specs?: string[] })
            );

            const spacesWithAvailability = spaces.map((space: ISpace) => {
                const spaceBookings = bookings.filter(
                    (booking) => booking.space?.toString() === space.id
                );

                const bookedSlots = spaceBookings.map((booking) => {
                    const normalizedTime = normalizeBookingTime(booking.time);
                    const customer = booking.customer as { firstname?: string; lastname?: string } | null;
                    const packageInfo = booking.package as { name?: string } | null;
                    const event = booking.event as { title?: string } | null;
                    const customerName = [customer?.firstname, customer?.lastname]
                        .filter(Boolean)
                        .join(" ")
                        .trim();

                    return {
                        bookingId: booking.id,
                        time: normalizedTime,
                        coversAllDay: !normalizedTime,
                        customerName: customerName || "Unknown customer",
                        packageName: packageInfo?.name || "Unknown package",
                        eventTitle: event?.title || null,
                        status: booking.status,
                    };
                });

                const hasAllDayBooking = bookedSlots.some((slot) => slot.coversAllDay);
                const bookedSlotTimes = new Set(
                    bookedSlots
                        .map((slot) => slot.time)
                        .filter((slotTime): slotTime is string => Boolean(slotTime))
                );
                const isFullyBookedBySlots = slotTimes.every((slotTime) => bookedSlotTimes.has(slotTime));
                const hasBookedSlots = bookedSlots.length > 0;

                let status: "available" | "partial" | "unavailable" = "available";

                if (manuallyClosedDay || hasShutdownBooking || hasAllDayBooking || isFullyBookedBySlots) {
                    status = "unavailable";
                } else if (hasBookedSlots) {
                    status = "partial";
                }

                return {
                    id: space.id,
                    name: space.name,
                    status,
                    bookedSlots,
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
            const populatedBookings = await Booking.find({
                eventDate: { $gte: start, $lte: end },
                status: { $ne: "cancelled" },
            }).populate("package");
            const monthClosedDays = await ClosedDay.find({
                date: { $gte: start, $lte: end },
            });
            const closedDaySet = new Set(
                monthClosedDays.map((item) => format(item.date, "yyyy-MM-dd"))
            );

            const days: {
                date: string;
                status: "available" | "partial" | "unavailable";
                totalBookings: number;
            }[] = [];

            for (let d = start; d <= end; d = addDays(d, 1)) {
                const dateStr = format(d, "yyyy-MM-dd");
                const isManuallyClosed = closedDaySet.has(dateStr);

                // Filter the pre-fetched bookings for this day
                const dayBookings = bookings.filter(
                    (b) => format(b.eventDate, "yyyy-MM-dd") === dateStr
                );

                const dayPopulatedBookings = populatedBookings.filter(
                    (b) => format(b.eventDate, "yyyy-MM-dd") === dateStr
                );

                const hasShutdownBooking = dayPopulatedBookings.some((booking) =>
                    isShutdownPackage(booking.package as unknown as { name?: string; description?: string; specs?: string[] })
                );

                // Check each space's availability for this day
                // A space is "unavailable" if it has any booking for this day
                // A space is "available" if it has no bookings for this day
                const statuses = spaces.map((space: ISpace) => {
                    const spaceBookings = dayBookings.filter(
                        (b) => b.space?.toString() === space.id
                    );

                    // Day-based: if any booking exists, space is unavailable for the whole day
                    return spaceBookings.length > 0 ? "unavailable" : "available";
                });

                // Determine overall day status
                let overall: "available" | "partial" | "unavailable" = hasShutdownBooking || isManuallyClosed ? "unavailable" : "available";

                const hasBookedSpaces = statuses.some((s) => s === "unavailable");
                const hasAvailableSpaces = statuses.some((s) => s === "available");

                if (hasShutdownBooking || isManuallyClosed) {
                    overall = "unavailable";
                } else if (hasBookedSpaces && hasAvailableSpaces) {
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
