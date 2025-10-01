import APIResponse from "@/lib/APIResponse";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Booking from "@/models/Booking";
import Customer from "@/models/Customer";
import Event from "@/models/Event";
import Package from "@/models/Package";
import Space from "@/models/Space";
import { CreateBookingDto, CreateBookingInput, sanitizeBooking } from "@/types/Booking";
import { differenceInMinutes, parse } from "date-fns";
import { NextRequest } from "next/server";

export const POST = errorHandler(async (request: NextRequest) => {
    await connectDB();
    const body: CreateBookingInput = await request.json();

    // cant book for previous days
    const today = new Date();
    const bookingDate = new Date(body.date);
    if (bookingDate <= today) {
        throw APIError.BadRequest("Please select a future date for the booking.");
    }


    // Validate times
    const start = parse(body.startTime, "HH:mm", new Date());
    const end = parse(body.endTime, "HH:mm", new Date());

    const minutes = differenceInMinutes(end, start);
    if (minutes < 0) throw APIError.BadRequest("End time must be after start time");

    // convert fractions to full date ie: 09:59 should be 09:00
    if (minutes % 60 !== 0) {
        body.endTime = `${Math.floor(end.getHours())}:00`;
    }
    let hours = minutes / 60;
    hours = Math.ceil(hours); // round up to nearest hour

    // start time cannot be before 8am or after 8pm
    // if (start.getHours() < 8 || start.getHours() > 20) {
    //     throw APIError.BadRequest("Bookings can only be made between 08:00 and 20:00");
    // }

    const isBooked = await Booking.isDoubleBooked(
        body.spaceId,
        new Date(body.date),
        body.startTime,
        body.endTime
    );
    if (isBooked) throw APIError.Conflict("The selected space is already booked for the specified date and time.");

    // Validate space
    const space = await Space.findById(body.spaceId);
    if (!space) throw APIError.NotFound("Space not found");

    // Validate package
    const _package = await Package.findById(body.packageId);
    if (!_package) throw APIError.NotFound("Package not found");

    // Validate with Zod
    CreateBookingDto.parse(body);

    // Ensure customer exists (upsert)
    const customer = await Customer.findOneAndUpdate(
        { email: body.email },
        {
            $set: {
                firstname: body.firstName,
                lastname: body.lastName,
                phone: body.phone,
            },
        },
        { new: true, upsert: true }
    );


    // Create event
    const event = await Event.create({
        title: body.eventTitle,
        description: body.eventDescription,
        customer: customer.id,
        type: body.eventType,
        public: body.public,
        date: body.date,
        time: { start: body.startTime, end: body.endTime },
        status: "pending",
        location: space.address,
    });

    // Calculate totalPrice round up to nearest whole number
    const totalPrice = Math.round((space.pricePerHour * hours) + _package.price);

    // Create booking
    const booking = await Booking.create({
        customer: customer.id,
        space: space.id,
        event: event.id,
        package: _package.id,
        eventDate: new Date(body.date),
        startTime: body.startTime,
        endTime: body.endTime,
        status: "pending",
        totalPrice,
    });

    return APIResponse.success(
        "New booking created successfully",
        {
            booking: {
                id: booking.id,
                customer: {
                    name: `${customer.firstname} ${customer.lastname}`,
                    email: customer.email,
                    phone: customer.phone,
                },
                space: {
                    name: space.name,
                    pricePerHour: space.pricePerHour,
                },
                package: {
                    name: _package.name,
                    price: _package.price,
                },
                eventDate: booking.eventDate,
                startTime: booking.startTime,
                endTime: booking.endTime,
                status: booking.status,
                totalPrice: booking.totalPrice,
            }
        },
        201
    );
});


export const GET = errorHandler(
    async () => {
        await connectDB();
        const bookings = await Booking.find()
            .populate("customer")
            .populate("space")
            .populate("event")
            .populate("package")

        if (bookings.length === 0) {
            throw APIError.NotFound("No bookings found");
        }

        const safeBookings = bookings.map((booking) => sanitizeBooking(booking));

        // remove booking.event.customer
        safeBookings.forEach((booking) => {
            if (booking.event && 'customer' in booking.event) {
                delete booking.event.customer;
            }
        });

        return APIResponse.success(
            "Fetched all bookings",
            { bookings: safeBookings },
            200
        );
    }
);