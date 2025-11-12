import APIResponse from "@/lib/APIResponse";
// import { uploadToCloudinary } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import { sendBookingEmail } from "@/lib/mailer";
import { sendNotification } from "@/lib/notification";
import { uploadImage } from "@/lib/vercel";
import Booking from "@/models/Booking";
import Customer from "@/models/Customer";
import Event from "@/models/Event";
import Package from "@/models/Package";
import Space from "@/models/Space";
import {
  CreateBookingDto,
  CreateBookingInput,
  sanitizeBooking,
} from "@/types/Booking";
import {
  addDays,
  addHours,
  differenceInMinutes,
  isBefore,
  isSameDay,
  parse,
  startOfToday,
} from "date-fns";
import { NextRequest } from "next/server";

export const POST = errorHandler(async (request: NextRequest) => {
  await connectDB();

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    throw APIError.BadRequest("Content-Type must be multipart/form-data");
  }

  const form = await request.formData();
  const images = form.getAll("images") as File[];

  if (images.length > 5) {
    throw APIError.BadRequest(
      "You can only upload a maximum of 5 images at once",
    );
  }

  const pblc = form.get("public") as string; //public
  const _public = pblc === "true" ? true : false;

  const data: Partial<CreateBookingInput> = {
    firstName: form.get("firstName") as string,
    lastName: form.get("lastName") as string,
    email: form.get("email") as CreateBookingInput["email"],
    phone: form.get("phone") as CreateBookingInput["phone"],
    date: form.get("date") as CreateBookingInput["date"],
    startTime: form.get("startTime") as CreateBookingInput["startTime"],
    endTime: form.get("endTime") as CreateBookingInput["endTime"],
    spaceId: form.get("spaceId") as CreateBookingInput["spaceId"],
    packageId: form.get("packageId") as CreateBookingInput["packageId"],
    eventTitle: form.get("eventTitle") as CreateBookingInput["eventTitle"],
    // eventType: form.get("eventType") as CreateBookingInput["eventType"],
    eventDescription: form.get(
      "eventDescription",
    ) as CreateBookingInput["eventDescription"],
    public: _public,
    imagesUrls: [],
  };

  data.imagesUrls = await Promise.all(
    images.map(async (image) => {
      const imageUrl = await uploadImage(image);
      return imageUrl;
    }),
  );

  // Validate with Zod
  const body = CreateBookingDto.parse(data);

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
      throw new APIError(
        200,
        "Bookings must be made at least 1 hour in advance",
      );
    }
  }
  // 3️⃣ Future dates are automatically fine

  // Validate times
  const start = parse(body.startTime, "HH:mm", new Date());
  const end = parse(body.endTime, "HH:mm", new Date());

  const minutes = differenceInMinutes(end, start);
  if (minutes <= 0)
    throw APIError.BadRequest("End time must be after start time");

  // start time cannot be before 8am or after 8pm
  if (start.getHours() < 8 || start.getHours() > 21) {
    throw new APIError(
      200,
      "Bookings can only be made between 08:00 and 21:00",
    );
  }

  // Compute total hours precisely (for pricing)
  const exactHours = minutes / 60;

  // Keep user’s original times for the Event
  const eventStartTime = body.startTime;
  const eventEndTime = body.endTime;

  // Create rounded versions for Booking
  const roundedStartTime = `${String(start.getHours()).padStart(2, "0")}:00`;
  const roundedEndTime = `${String(Math.ceil(end.getHours())).padStart(2, "0")}:00`;

  // Double booking check should use rounded hours
  const isBooked = await Booking.isDoubleBooked(
    body.spaceId,
    new Date(body.date),
    roundedStartTime,
    roundedEndTime,
  );
  if (isBooked)
    throw new APIError(
      200,
      "The selected space is already booked for the specified date and time.",
    );

  // Validate space and package
  const space = await Space.findById(body.spaceId);
  if (!space) throw APIError.NotFound("Space not found");

  const _package = await Package.findById(body.packageId);
  if (!_package) throw APIError.NotFound("Package not found");

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
    { new: true, upsert: true },
  );

  const slug = body.eventTitle
    .trim()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  console.log(slug);

  // Create event (keep original times)
  const event = await Event.create({
    title: body.eventTitle,
    slug,
    description: body.eventDescription,
    customer: customer.id,
    public: body.public,
    date: body.date,
    time: { start: eventStartTime, end: eventEndTime },
    status: "pending",
    images: body.imagesUrls,
    location: space.address,
  });

  // Calculate totalPrice using exact hours (not rounded)
  const totalPrice = Math.round(
    space.pricePerHour * exactHours + _package.price,
  );

  // Create booking (use rounded hours for schedule management)
  const booking = await Booking.create({
    customer: customer.id,
    space: space.id,
    event: event.id,
    package: _package.id,
    eventDate: new Date(body.date),
    startTime: roundedStartTime,
    endTime: roundedEndTime,
    status: "pending",
    totalPrice,
  });

  try {
    await sendBookingEmail(customer.email);
    await sendNotification({
      type: "booking",
      title: "New Booking",
      message: "A Customer just completed Booking",
      meta: { booking },
      permission: 2,
    });
  } catch (error) {
    throw APIError.Internal(`Error sending email: ${(error as Error).message}`);
  }

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
        startTime: event.time.start,
        endTime: event.time.end,
        status: booking.status,
        totalPrice: booking.totalPrice,
      },
    },
    201,
  );
});

export const GET = errorHandler(async (request: NextRequest) => {
  await connectDB();

  // --- Query params ---
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const sort = searchParams.get("sort") || "date";
  const direction = (searchParams.get("direction") as "ASC" | "DESC") || "ASC";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Handle limit (if not provided → no pagination)
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : null;

  // --- Filter logic ---
  const filter: Record<string, string> = {};

  if (status && status !== "past") {
    filter.status = status;
  }

  if (status === "past") {
    const now = new Date();
    const cutoffHour = now.getHours() - 1;
    const cutoffTimeStr = `${String(cutoffHour).padStart(2, "0")}:00`;

    Object.assign(filter, {
      status: "confirmed",
      $or: [
        // Bookings from previous days
        { eventDate: { $lt: startOfToday() } },
        // Bookings from today but whose startTime is <= cutoff hour
        {
          eventDate: {
            $gte: startOfToday(),
            $lt: addDays(startOfToday(), 1),
          },
          startTime: { $lte: cutoffTimeStr },
        },
      ],
    });
  }

  // --- Fetch bookings ---
  const bookings = await Booking.filter(filter, sort, direction);
  if (!bookings || bookings.length === 0)
    return APIResponse.success("No bookings found", { bookings: [] });

  // --- Pagination ---
  let paginatedBookings = bookings;
  let pagination = undefined;

  if (limit) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    paginatedBookings = bookings.slice(startIndex, endIndex);

    pagination = {
      currentPage: page,
      totalPages: Math.ceil(bookings.length / limit),
      pageSize: limit,
      totalItems: bookings.length,
      nextPage: endIndex < bookings.length ? page + 1 : null,
      prevPage: startIndex > 0 ? page - 1 : null,
    };
  }

  // --- Sanitize ---
  const sanitizedBookings = paginatedBookings.map((event) =>
    sanitizeBooking(event),
  );
  sanitizedBookings.forEach((booking) => {
    if (booking.event && "customer" in booking.event) {
      delete booking.event.customer;
    }
  });

  // --- Response ---
  return APIResponse.success(
    "Fetched all bookings",
    { bookings: sanitizedBookings, pagination },
    200,
  );
});
