import APIResponse from "@/lib/APIResponse";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Event from "@/models/Event";
import SignUp from "@/models/SignUp";
import AddOn from "@/models/AddOn";
import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAuth, requireRole } from "@/lib/auth";

const RegisterEventDTO = z.object({
  name: z.string().trim().min(1, "Name is required"),
  phone: z.string().trim().min(1, "Phone number is required"),
  email: z.string().trim().email("Invalid email address"),
  adultsComing: z.coerce.number().int().min(0, "Adults count cannot be negative"),
  childrenComing: z.coerce.number().int().min(0, "Children count cannot be negative"),
  addons: z.array(z.string().trim().min(1, "Addon id cannot be empty")).optional().default([]),
});

type RegisterEventInput = z.infer<typeof RegisterEventDTO>;

export const POST = errorHandler(async (request: NextRequest, context) => {
  await connectDB();

  const { id } = await context.params;
  const payload = await request.json().catch(() => null);

  if (!payload) {
    throw APIError.BadRequest("Request body is required");
  }

  const addonIds = Array.isArray((payload as { addons?: unknown }).addons)
    ? (payload as { addons: string[] }).addons
    : Array.isArray((payload as { addonIds?: unknown }).addonIds)
      ? (payload as { addonIds: string[] }).addonIds
      : [];

  const data = RegisterEventDTO.parse({
    ...payload,
    addons: addonIds,
  } as RegisterEventInput);

  const event = await Event.findOne({
    $or: [{ _id: id }, { slug: id }],
  });

  if (!event) {
    throw APIError.NotFound("Event not found");
  }

  if (data.addons.length > 0) {
    const foundAddons = await AddOn.find({ _id: { $in: data.addons } });
    if (foundAddons.length !== data.addons.length) {
      throw APIError.BadRequest("One or more selected add-ons are invalid");
    }
  }

  const registration = await SignUp.create({
    eventId: event._id,
    name: data.name,
    phone: data.phone,
    email: data.email,
    adultsComing: data.adultsComing,
    childrenComing: data.childrenComing,
    addons: data.addons,
  });

  return APIResponse.success("Event registration successful", {
    registration,
  }, 201);
});

export const GET = errorHandler(async (request: NextRequest, context) => {
  await connectDB();

  const payload = requireAuth(request);
  const isPermitted = await requireRole(payload, "admin", "manager");

  if (!isPermitted) {
    throw APIError.Forbidden("No permission to access this endpoint");
  }

  const { id } = await context.params;

  const event = await Event.findOne({
    $or: [{ _id: id }, { slug: id }],
  });

  if (!event) {
    throw APIError.NotFound("Event not found");
  }

  const registrations = await SignUp.find({ eventId: event._id }).sort({ createdAt: -1 });

  return APIResponse.success("Event registrations fetched successfully", {
    event: {
      id: event._id,
      title: event.title,
      slug: event.slug,
    },
    registrations,
  });
});
