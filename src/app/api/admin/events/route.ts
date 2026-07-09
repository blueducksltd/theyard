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
import { uploadImage } from "@/lib/vercel";

function parseOptionalNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

function parseBoolean(value: unknown, defaultValue = false): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return defaultValue;
}

export const POST = errorHandler(async (request: NextRequest) => {
  await connectDB();
  const payload = requireAuth(request);

  const isPermitted = await requireRole(payload, "admin", "manager");
  if (!isPermitted) {
    throw APIError.Forbidden("No permission to access this endpoint");
  }

  const contentType = request.headers.get("content-type") ?? "";
  const isMultipart = contentType.includes("multipart/form-data");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let inputData: any = {};
  let imageUrls: string[] = [];

  if (isMultipart) {
    const form = await request.formData();
    
    const activitiesStr = form.get("activities") as string;
    const activities = activitiesStr 
      ? activitiesStr.split(",").map(s => s.trim()).filter(Boolean)
      : [];

    inputData = {
      title: form.get("title") as string,
      description: (form.get("description") as string) || undefined,
      date: form.get("date") as string,
      time: form.get("time") as string,
      audienceType: form.get("audienceType") as "children" | "adults" | "both",
      adultPrice: form.get("adultPrice"),
      childPrice: form.get("childPrice"),
      public: form.get("public"),
      location: (form.get("location") as string) || undefined,
      customerId: (form.get("customerId") as string) || undefined,
      activities,
    };

    const files = form.getAll("images") as File[];
    if (files.length > 0) {
      const uploadPromises = files.map(file => uploadImage(file));
      imageUrls = await Promise.all(uploadPromises);
    }
  } else {
    inputData = await request.json();
    imageUrls = inputData.images || [];
  }

  const data = CreateEventAdminDTO.parse({
    ...inputData,
    adultPrice: parseOptionalNumber(inputData.adultPrice),
    childPrice: parseOptionalNumber(inputData.childPrice),
    public: parseBoolean(inputData.public),
    images: imageUrls,
  });

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
  if (data.customerId) {
    const customer = await Customer.findById(data.customerId);
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
    activities: data.activities || [],
    adultPrice: data.adultPrice,
    childPrice: data.childPrice,
    status: "pending",
    location: data.location || "The Yard",
    images: data.images || [],
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
