import APIResponse from "@/lib/APIResponse";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Booking from "@/models/Booking";
import Event from "@/models/Event";
import { IBooking, sanitizeBooking, UpdateBookingDto, UpdateBookingInput } from "@/types/Booking";
import { NextRequest } from "next/server";


export const PUT = errorHandler<{ params: { id: string } }>(
    async (request: NextRequest, context) => {

        await connectDB();

        requireAuth(request);
        const { id } = await context.params;
        const body: UpdateBookingInput = await request.json();
        const data = UpdateBookingDto.parse(body);

        // ✅ Update the booking
        await Booking.findByIdAndUpdate(id, data);

        // ✅ Retrieve the updated booking with all refs populated
        const booking = await Booking.findById(id)
            .populate("customer")
            .populate("space")
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
                // Reflect updated status locally
                (booking.event as any).status = eventStatus;
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