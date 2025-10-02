import APIResponse from "@/lib/APIResponse";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Booking from "@/models/Booking";
import Customer from "@/models/Customer";
import Event from "@/models/Event";
import Package from "@/models/Package";
import Space from "@/models/Space";
import { CreateBookingDto, CreateBookingInput, sanitizeBooking } from "@/types/Booking";
import { addHours, differenceInMinutes, isBefore, isSameDay, parse } from "date-fns";
import { NextRequest } from "next/server";

export const POST = errorHandler(async (request: NextRequest) => {
    await connectDB();
    const body: CreateBookingInput = await request.json();

    const now = new Date();

    // Parse booking date (yyyy-MM-dd) into midnight of that day
    const bookingDate = parse(body.date, "yyyy-MM-dd", new Date());

    // Parse startTime (HH:mm) on the chosen date
    const bookingStart = parse(body.startTime, "HH:mm", bookingDate);

    // 1️⃣ Past date check
    if (isBefore(bookingDate, new Date(now.toDateString()))) {
        throw APIError.BadRequest("Booking date must be today or in the future");
    }

    // 2️⃣ Today’s date special rule
    if (isSameDay(bookingDate, now)) {
        const minStartTime = addHours(now, 1);
        if (isBefore(bookingStart, minStartTime)) {
            throw APIError.BadRequest("Bookings must be made at least 1 hour in advance");
        }
    }
    // 3️⃣ Future dates are automatically fine


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
    async (request: NextRequest) => {
        await connectDB();
        const authHeader = request.headers.get("authorization");
        let admin = false;
        if (authHeader) {
            const payload = requireAuth(request);
            // Role is not required, just checking if admin to show all bookings
            if (payload) admin = true;
        }


        // const safeBookings = bookings.map((booking) => sanitizeBooking(booking));

        // // remove booking.event.customer
        // safeBookings.forEach((booking) => {
        //     if (booking.event && 'customer' in booking.event) {
        //         delete booking.event.customer;
        //     }
        // });


        // check query params
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const sort = searchParams.get("sort") || "date";
        const direction = (searchParams.get("direction") as "ASC" | "DESC") || "ASC";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        const filter = {};
        if (status) Object.assign(filter, { status });

        const bookings = await Booking.filter(filter, sort, direction, admin);
        if (!bookings) throw APIError.NotFound("No bookings found");
        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedBookings = bookings.slice(startIndex, endIndex);

        if (paginatedBookings.length === 0) return APIResponse.success("No bookings found", { bookings: [] });

        const sanitizedBookings = paginatedBookings.map(event => sanitizeBooking(event));

        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(bookings.length / limit),
            pageSize: limit,
            totalItems: bookings.length,
            nextPage: endIndex < bookings.length ? page + 1 : null,
            prevPage: startIndex > 0 ? page - 1 : null
        }

        return APIResponse.success(
            "Fetched all bookings",
            { bookings: sanitizedBookings, pagination },
            200
        );
    }
);