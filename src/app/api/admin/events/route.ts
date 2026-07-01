import { NextRequest } from "next/server";
import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Customer from "@/models/Customer";
import Event from "@/models/Event";
import { CreateEventAdminDTO, CreateEventAdminInput, sanitizeEvent } from "@/types/Event";
import { Types } from "mongoose";

export const POST = errorHandler(async (request: NextRequest) => {
  await connectDB();
  const payload = requireAuth(request);

  const isPermitted = await requireRole(payload, "admin", "manager");
  if (!isPermitted) {
    throw APIError.Forbidden("No permission to access this endpoint");
  }

  const body: CreateEventAdminInput = await request.json();
  const data = CreateEventAdminDTO.parse(body);

  const slug = data.title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const exists = await Event.findOne({ slug });
  if (exists) {
    throw APIError.Conflict("Event with this title already exists");
  }

  let customerId: Types.ObjectId;
  if (body.customerId) {
    const customer = await Customer.findById(body.customerId);
    if (!customer) throw APIError.NotFound("Customer not found");
    customerId = customer._id as Types.ObjectId;
  } else {
    const placeholderCustomer = await Customer.create({
      firstname: "Admin",
      lastname: "Event",
      email: `admin-event-${Date.now()}@placeholder.com`,
      phone: "0000000000",
    });
    customerId = placeholderCustomer._id as Types.ObjectId;
  }

  const event = await Event.create({
    title: data.title,
    slug,
    description: data.description || "",
    customer: customerId,
    public: data.public ?? false,
    date: new Date(data.date),
    time: { start: data.time, end: data.time },
    audienceType: data.audienceType,
    adultPrice: data.adultPrice,
    childPrice: data.childPrice,
    status: "pending",
    location: data.location || "The Yard",
  });

  await event.populate("customer");

  return APIResponse.success("Event created successfully", { event: sanitizeEvent(event) }, 201);
});

export const GET = errorHandler(async (request: NextRequest) => {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const filter: Record<string, string> = {};
  if (status) filter.status = status;

  const events = await Event.find(filter).sort({ date: 1 });
  const safeEvents = events.map((event) => sanitizeEvent(event));

  return APIResponse.success("Fetched events successfully", { events: safeEvents }, 200);
});
