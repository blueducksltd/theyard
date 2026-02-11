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
  isBefore,
  parse,
  parseISO,
  startOfDay,
  startOfToday,
  isWeekend
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
    guestCount: Number(form.get("guestCount")) as CreateBookingInput["guestCount"],
    spaceId: form.get("spaceId") as CreateBookingInput["spaceId"],
    packageId: form.get("packageId") as CreateBookingInput["packageId"],
    eventTitle: form.get("eventTitle") as CreateBookingInput["eventTitle"],
    // eventType: form.get("eventType") as CreateBookingInput["eventType"],
    eventDescription: form.get(
      "eventDescription"
    ) as CreateBookingInput["eventDescription"] ?? undefined,
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

  // Constants for date validation (improves maintainability)
  const PAST_DATE_ERROR_MESSAGE = "Bookings must be made at least 1 day in advance";
  const INVALID_DATE_ERROR_MESSAGE = "Invalid date format. Please use YYYY-MM-DD format";

  // Get current date at midnight (start of today) for accurate comparison
  const today = startOfToday();

  // Flexible date parsing helper (handles multiple frontend formats)
  const parseBookingDate = (dateStr: string): Date | null => {
    // Try ISO 8601 first (e.g., "2026-02-04T22:02:44.543Z")
    try {
      const isoDate = parseISO(dateStr);
      if (!isNaN(isoDate.getTime())) {
        return startOfDay(isoDate);
      }
    } catch {
      // Continue to next format
    }

    // Try YYYY-MM-DD format
    try {
      const parsedDate = parse(dateStr, "yyyy-MM-dd", new Date());
      if (!isNaN(parsedDate.getTime())) {
        return startOfDay(parsedDate);
      }
    } catch {
      // Continue to next format
    }

    // Try MM/DD/YYYY format (common US format)
    try {
      const parsedDate = parse(dateStr, "MM/dd/yyyy", new Date());
      if (!isNaN(parsedDate.getTime())) {
        return startOfDay(parsedDate);
      }
    } catch {
      // Continue to next format
    }

    // Try DD/MM/YYYY format (common international format)
    try {
      const parsedDate = parse(dateStr, "dd/MM/yyyy", new Date());
      if (!isNaN(parsedDate.getTime())) {
        return startOfDay(parsedDate);
      }
    } catch {
      // Continue to next format
    }

    return null;
  };

  // Parse booking date with flexible format support
  const bookingDate = parseBookingDate(body.date);

  if (!bookingDate) {
    throw APIError.BadRequest(INVALID_DATE_ERROR_MESSAGE);
  }

  // Validate booking date is at least 1 day in the future
  if (isBefore(bookingDate, today)) {
    throw APIError.BadRequest(PAST_DATE_ERROR_MESSAGE);
  }

  // Check double booking (space already booked for this day)
  const isBooked = await Booking.isDoubleBooked(
    body.spaceId,
    bookingDate, // Use the parsed date object
  );
  if (isBooked)
    throw new APIError(
      200,
      "The selected space is already booked for the specified date.",
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

  // Create event (no times needed for day experience)
  const event = await Event.create({
    title: body.eventTitle,
    slug,
    description: body.eventDescription,
    customer: customer.id,
    public: body.public,
    date: bookingDate, // Use the parsed date object
    time: { start: "09:00", end: "18:00" }, // Default day hours
    status: "pending",
    images: body.imagesUrls,
    location: space.address,
  });

  // Calculate base price (weekend price if applicable)
  const basePrice = isWeekend(bookingDate) && _package.weekendPrice
    ? _package.weekendPrice
    : _package.price;

  // Calculate totalPrice using guestCount, guestLimit, and extraGuestFee
  const guestLimit = _package.guestLimit as unknown as number;
  const extraGuestFee = _package.extraGuestFee as unknown as number;
  const guestCount = body.guestCount;

  let totalPrice = basePrice as unknown as number;
  if (guestCount > guestLimit) {
    const extraGuests = guestCount - guestLimit;
    totalPrice += extraGuests * extraGuestFee;
  }


  // Create booking (day-based, no times)
  const booking = await Booking.create({
    customer: customer.id,
    space: space.id,
    event: event.id,
    package: _package.id,
    eventDate: bookingDate, // Use the parsed date object
    guestCount,
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
        },
        package: {
          name: _package.name,
          price: _package.price,
          guestLimit: _package.guestLimit,
          extraGuestFee: _package.extraGuestFee,
        },
        eventDate: booking.eventDate,
        guestCount: booking.guestCount,
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
    Object.assign(filter, {
      status: "confirmed",
      eventDate: { $lt: startOfToday() },
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
