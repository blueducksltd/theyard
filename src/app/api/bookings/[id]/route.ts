import APIResponse from "@/lib/APIResponse";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Booking from "@/models/Booking";
import Event from "@/models/Event";
import { IBooking, sanitizeBooking, UpdateBookingDto, UpdateBookingInput } from "@/types/Booking";
import { NextRequest } from "next/server";
import { sendBookingConfirmedEmail } from "@/lib/mailer";
import { sendBookingDeclinedEmail } from "@/lib/mailer";
import { sendBookingConfirmedWhatsApp } from "@/lib/whatsapp";
import { ICustomer } from "@/types/Customer";
import { endOfDay, isValid, parse, parseISO, startOfDay } from "date-fns";

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

function parseBookingDate(date?: string): Date | null {
    if (!date) return null;

    const parsedIso = parseISO(date);
    if (isValid(parsedIso)) {
        return parsedIso;
    }

    const parsedDate = parse(date, "yyyy-MM-dd", new Date());
    if (isValid(parsedDate)) {
        return parsedDate;
    }

    return null;
}


export const PUT = errorHandler<{ params: { id: string } }>(
    async (request: NextRequest, context) => {

        await connectDB();

        requireAuth(request);
        const { id } = await context.params;
        const body: UpdateBookingInput = await request.json();
        const data = UpdateBookingDto.parse(body);

        // ✅ Check previous status of the booking
        const oldBooking = await Booking.findById(id);
        const oldStatus = oldBooking?.status;
        const wasConfirmed = oldStatus === "confirmed";
        const wasCancelled = oldStatus === "cancelled";

        const nextStatus = data.status ?? oldBooking?.status;
        const nextSpaceId = data.spaceId ?? oldBooking?.space?.toString();
        const parsedIncomingDate = parseBookingDate(data.date);
        const nextEventDate = parsedIncomingDate ?? oldBooking?.eventDate ?? null;
        const nextTime = normalizeBookingTime(data.time ?? oldBooking?.time ?? null);

        if (nextStatus !== "cancelled" && nextSpaceId && nextEventDate) {
            const sameDayBookings = await Booking.find({
                _id: { $ne: id },
                eventDate: {
                    $gte: startOfDay(nextEventDate),
                    $lte: endOfDay(nextEventDate),
                },
                status: { $ne: "cancelled" },
                space: nextSpaceId,
            });

            const conflictingBooking = sameDayBookings.find((booking) => {
                const existingTime = normalizeBookingTime(booking.time);

                if (!existingTime || !nextTime) {
                    return true;
                }

                return existingTime === nextTime;
            });

            if (conflictingBooking) {
                const conflictingTime = normalizeBookingTime(conflictingBooking.time);
                throw APIError.BadRequest(
                    conflictingTime
                        ? `This space is already booked at ${conflictingTime} on this date.`
                        : "This space is already booked for this date.",
                );
            }
        }

        // ✅ Update the booking
        await Booking.findByIdAndUpdate(id, data);

        // ✅ Retrieve the updated booking with all refs populated
        const booking = await Booking.findById(id)
            .populate("customer")
            .populate("event")
            .populate("package");

        if (!booking) throw APIError.NotFound(`Booking with id: ${id} not found`);

        // ✅ Only update event status if data.status is explicitly provided
        if (data.status && booking.event) {
            let eventStatus: string | undefined;

            if (data.status === "confirmed") eventStatus = "active";
            else if (data.status === "cancelled") eventStatus = "cancelled";

            if (eventStatus) {
                await Event.findByIdAndUpdate(booking.event._id, { status: eventStatus });
            }
        }

        // ✅ Send notifications only when status actually changes.
        if (data.status === "confirmed" && !wasConfirmed) {
            const customer = booking.customer as unknown as ICustomer;
            if (customer && customer.email) {
                try {
                    await sendBookingConfirmedEmail(customer.email, booking.id);
                    await sendBookingConfirmedWhatsApp(booking.id);
                } catch (error) {
                    console.error("Failed to send booking confirmation notification:", error);
                }
            }
        }

        if (data.status === "cancelled" && !wasCancelled) {
            const customer = booking.customer as unknown as ICustomer;
            if (customer && customer.email) {
                try {
                    await sendBookingDeclinedEmail(customer.email, booking.id);
                } catch (error) {
                    console.error("Failed to send booking decline notification:", error);
                }
            }
        }

        // ✅ Sanitize before returning
        const sanitizedBooking = sanitizeBooking(booking as IBooking);
        if (sanitizedBooking.event && "customer" in sanitizedBooking.event) {
            delete sanitizedBooking.event.customer;
        }

        return APIResponse.success(
            "Booking updated successfully",
            { booking: sanitizedBooking },
            200
        );
    }
);


export const DELETE = errorHandler<{ params: { id: string } }>(
    async (request: NextRequest, context) => {
        await connectDB();

        requireAuth(request);
        const { id } = await context.params;
        const bookingExist = await Booking.findById(id);
        if (!bookingExist) throw APIError.NotFound(`Booking with id: ${id} not found`);

        if (bookingExist.status == "confirmed") throw APIError.BadRequest("The requested booking can no longer be deleted, it has been confirmed")

        const event = bookingExist.event;
        await Event.findByIdAndDelete(event);
        await Booking.findByIdAndDelete(id);

        return APIResponse.success(`Booking with id ${id} and related event ${event}`, undefined);
    }
)