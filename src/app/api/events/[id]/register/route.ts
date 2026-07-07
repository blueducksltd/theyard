import APIResponse from "@/lib/APIResponse";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Event from "@/models/Event";
import SignUp from "@/models/SignUp";
import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAuth, requireRole } from "@/lib/auth";

const RegisterEventDTO = z.object({
  name: z.string().trim().min(1, "Name is required"),
  phone: z.string().trim().min(1, "Phone number is required"),
  email: z.string().trim().email("Invalid email address"),
  adultsComing: z.coerce.number().int().min(0, "Adults count cannot be negative"),
  childrenComing: z.coerce.number().int().min(0, "Children count cannot be negative"),
});

type RegisterEventInput = z.infer<typeof RegisterEventDTO>;

export const POST = errorHandler(async (request: NextRequest, context) => {
  await connectDB();

  const { id } = await context.params;
  const payload = await request.json().catch(() => null);

  if (!payload) {
    throw APIError.BadRequest("Request body is required");
  }

  const data = RegisterEventDTO.parse(payload as RegisterEventInput);

  const event = await Event.findOne({
    $or: [{ _id: id }, { slug: id }],
  });

  if (!event) {
    throw APIError.NotFound("Event not found");
  }

  const registration = await SignUp.create({
    eventId: event._id,
    name: data.name,
    phone: data.phone,
    email: data.email,
    adultsComing: data.adultsComing,
    childrenComing: data.childrenComing,
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
