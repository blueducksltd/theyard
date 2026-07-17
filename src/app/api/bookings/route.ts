import APIResponse from "@/lib/APIResponse";
// import { uploadToCloudinary } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import { sendBookingEmail } from "@/lib/mailer";
import { sendBookingWhatsApp } from "@/lib/whatsapp";
import { sendNotification } from "@/lib/notification";
import Booking from "@/models/Booking";
import ClosedDay from "@/models/ClosedDay";
import Customer from "@/models/Customer";
import Package from "@/models/Package";
import AddOn from "@/models/AddOn";
import { isShutdownPackage } from "@/lib/packageRules";
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
  endOfDay,
  startOfToday,
  isWeekend
} from "date-fns";
import { NextRequest } from "next/server";

export const POST = errorHandler(async (request: NextRequest) => {
  await connectDB();

  const contentType = request.headers.get("content-type") ?? "";
  const isMultipart = contentType.includes("multipart/form-data");
  const isJson = contentType.includes("application/json");

  let data: Partial<CreateBookingInput> = {};

  if (isMultipart) {
    const form = await request.formData();

    data = {
      firstName: form.get("firstName") as string,
      lastName: form.get("lastName") as string,
      email: form.get("email") as CreateBookingInput["email"],
      phone: form.get("phone") as CreateBookingInput["phone"],
      date: form.get("date") as CreateBookingInput["date"],
      guestCount: Number(form.get("guestCount")) as CreateBookingInput["guestCount"],
      packageId: form.get("packageId") as CreateBookingInput["packageId"],
      spaceId: form.get("spaceId") as CreateBookingInput["spaceId"] ?? undefined,
      time: form.get("time") as CreateBookingInput["time"] ?? undefined,
      addon: form.getAll("addon").map((item) => item as string) as CreateBookingInput["addon"],
      eventDescription: form.get(
        "eventDescription"
      ) as CreateBookingInput["eventDescription"] ?? undefined,
    };
  } else if (isJson) {
    const body = await request.json();
    data = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      date: body.date,
      guestCount: body.guestCount,
      packageId: body.packageId,
      spaceId: body.spaceId,
      time: body.time,
      addon: Array.isArray(body.addon) ? body.addon : body.addon ? [body.addon] : undefined,
      eventDescription: body.eventDescription,
    };
  } else {
    throw APIError.BadRequest("Content-Type must be multipart/form-data or application/json");
  }

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

  const _package = await Package.findById(body.packageId);
  if (!_package) throw APIError.NotFound("Package not found");

  const manuallyClosedDay = await ClosedDay.findOne({
    date: {
      $gte: startOfDay(bookingDate),
      $lte: endOfDay(bookingDate),
    },
  });

  if (manuallyClosedDay) {
    throw APIError.BadRequest(
      "This date has been closed by the admin. Please choose another day.",
    );
  }

  const isRequestedShutdownPackage = isShutdownPackage(_package);
  const dayBookings = await Booking.find({
    eventDate: {
      $gte: startOfDay(bookingDate),
      $lte: endOfDay(bookingDate),
    },
    status: { $ne: "cancelled" },
  }).populate("package");

  const hasShutdownBooking = dayBookings.some((booking) =>
    isShutdownPackage(booking.package as unknown as { name?: string; description?: string; specs?: string[] }),
  );

  if (hasShutdownBooking) {
    throw APIError.BadRequest(
      "This date is already reserved by the shutdown package. Please choose another day.",
    );
  }

  if (isRequestedShutdownPackage && dayBookings.length > 0) {
    throw APIError.BadRequest(
      "The shutdown package reserves the full day. Please choose an empty date.",
    );
  }

  const packageCapacity = Number(_package.capacity ?? 0);
  if (!isRequestedShutdownPackage && packageCapacity > 0) {
    const existingBookingsCount = dayBookings.filter((booking) =>
      booking.package && booking.package.toString() === _package.id,
    ).length;

    if (existingBookingsCount >= packageCapacity) {
      throw APIError.BadRequest(
        "This package is fully booked for the selected date. Please choose another day.",
      );
    }
  }

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

  // Event creation is disabled for bookings.
  // const slug = body.eventTitle
  //   .trim()
  //   .toLowerCase()
  //   .trim()
  //   .replace(/[^a-z0-9\s-]/g, "")
  //   .replace(/\s+/g, "-")
  //   .replace(/-+/g, "-");
  //
  // const event = await Event.create({
  //   title: body.eventTitle,
  //   slug,
  //   description: body.eventDescription,
  //   customer: customer.id,
  //   public: body.public,
  //   date: bookingDate,
  //   time: { start: "09:00", end: "18:00" },
  //   status: "pending",
  //   images: body.imagesUrls,
  //   location: space.address,
  // });

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

  // Add selected add-on prices
  if (body.addon && body.addon.length > 0) {
    const addOnDocs = await AddOn.find({ _id: { $in: body.addon } });
    const addOnTotal = addOnDocs.reduce((sum, addOn) => {
      return sum + (addOn.price ?? 0);
    }, 0);
    totalPrice += addOnTotal;
  }

  // Create booking (day-based, no times)
  const booking = await Booking.create({
    customer: customer.id,
    package: _package.id,
    space: body.spaceId,
    eventDate: bookingDate,
    guestCount,
    time: body.time,
    addon: body.addon,
    status: "pending",
    totalPrice,
  });

  try {
    await sendBookingEmail(customer.email, booking.id);
    await sendBookingWhatsApp(booking.id);
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
        package: {
          name: _package.name,
          price: _package.price,
          guestLimit: _package.guestLimit,
          extraGuestFee: _package.extraGuestFee,
        },
        eventDate: booking.eventDate,
        guestCount: booking.guestCount,
        time: booking.time,
        addon: booking.addon,
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
