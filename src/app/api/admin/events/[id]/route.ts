import { NextRequest } from "next/server";
import { z } from "zod";
import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import { deleteImage, uploadImage } from "@/lib/vercel";
import Event from "@/models/Event";
import { sanitizeEvent } from "@/types/Event";

const UpdateEventAdminDTO = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    date: z.string().optional(),
    time: z.string().optional(),
    audienceType: z.enum(["children", "adults", "both"]).optional(),
    adultPrice: z.number().optional(),
    childPrice: z.number().optional(),
    public: z.boolean().optional(),
    location: z.string().optional(),
    activities: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    status: z.enum(["active", "completed", "cancelled", "pending"]).optional(),
  })
  .superRefine((data, ctx) => {
    const audience = data.audienceType;

    if ((audience === "adults" || audience === "both") && (data.adultPrice === undefined || data.adultPrice < 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["adultPrice"],
        message: "Adult price is required for adults/both events",
      });
    }

    if ((audience === "children" || audience === "both") && (data.childPrice === undefined || data.childPrice < 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["childPrice"],
        message: "Child price is required for children/both events",
      });
    }
  });

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

function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const PUT = errorHandler<{ params: { id: string } }>(async (request: NextRequest, context) => {
  await connectDB();

  const payload = requireAuth(request);
  const isPermitted = await requireRole(payload, "admin", "manager");
  if (!isPermitted) {
    throw APIError.Forbidden("No permission to access this endpoint");
  }

  const { id } = await context.params;
  const event = await Event.findById(id).populate("customer");
  if (!event) throw APIError.NotFound("Event not found");

  const contentType = request.headers.get("content-type") ?? "";
  const isMultipart = contentType.includes("multipart/form-data");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let inputData: any = {};
  let imageUrls: string[] | undefined;

  if (isMultipart) {
    const form = await request.formData();

    const activitiesStr = form.get("activities") as string;
    const activities = activitiesStr
      ? activitiesStr
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : undefined;

    inputData = {
      title: (form.get("title") as string) || undefined,
      description: (form.get("description") as string) || undefined,
      date: (form.get("date") as string) || undefined,
      time: (form.get("time") as string) || undefined,
      audienceType: (form.get("audienceType") as "children" | "adults" | "both") || undefined,
      adultPrice: form.get("adultPrice"),
      childPrice: form.get("childPrice"),
      public: form.get("public"),
      location: (form.get("location") as string) || undefined,
      status: (form.get("status") as "active" | "completed" | "cancelled" | "pending") || undefined,
      activities,
    };

    const files = form.getAll("images") as File[];
    if (files.length > 0) {
      imageUrls = await Promise.all(files.map((file) => uploadImage(file)));
    }
  } else {
    inputData = await request.json();
    imageUrls = inputData.images;
  }

  const data = UpdateEventAdminDTO.parse({
    ...inputData,
    adultPrice: parseOptionalNumber(inputData.adultPrice),
    childPrice: parseOptionalNumber(inputData.childPrice),
    public:
      inputData.public === undefined || inputData.public === null || inputData.public === ""
        ? undefined
        : parseBoolean(inputData.public),
    images: imageUrls,
  });

  let nextSlug = event.slug;
  if (data.title && data.title !== event.title) {
    const generated = toSlug(data.title);
    const conflict = await Event.findOne({ slug: generated, _id: { $ne: event._id } });
    if (conflict) throw APIError.Conflict("Event with this title already exists");
    nextSlug = generated;
  }

  if (data.images && event.images?.length) {
    await Promise.all(event.images.map((url: string) => deleteImage(url)));
  }

  event.title = data.title ?? event.title;
  event.slug = nextSlug;
  event.description = data.description ?? event.description;
  event.date = data.date ? new Date(data.date) : event.date;
  event.time = data.time ? { start: data.time, end: data.time } : event.time;
  event.audienceType = data.audienceType ?? event.audienceType;
  event.adultPrice = data.adultPrice ?? event.adultPrice;
  event.childPrice = data.childPrice ?? event.childPrice;
  event.public = data.public ?? event.public;
  event.location = data.location ?? event.location;
  event.status = data.status ?? event.status;
  event.activities = data.activities ?? event.activities;
  event.images = data.images ?? event.images;

  await event.save();
  await event.populate("customer");

  return APIResponse.success("Event updated successfully", { event: sanitizeEvent(event) }, 200);
});

export const DELETE = errorHandler<{ params: { id: string } }>(async (request: NextRequest, context) => {
  await connectDB();

  const payload = requireAuth(request);
  const isPermitted = await requireRole(payload, "admin", "manager");
  if (!isPermitted) {
    throw APIError.Forbidden("No permission to access this endpoint");
  }

  const { id } = await context.params;
  const event = await Event.findById(id);
  if (!event) throw APIError.NotFound("Event not found");

  if (event.images?.length) {
    await Promise.all(event.images.map((url: string) => deleteImage(url)));
  }

  await Event.findByIdAndDelete(id);

  return APIResponse.success("Event deleted successfully", { id }, 200);
});
