import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Space from "@/models/Space";
// import { CreateBookingDto } from "@/types/Booking";
import { CreateSpaceDto, CreateSpaceInput, sanitizeSpace } from "@/types/Space";
import { NextRequest } from "next/server";

export const POST = errorHandler(async (request: NextRequest) => {
  await connectDB();
  const body: CreateSpaceInput = CreateSpaceDto.parse(await request.json());

  const payload = requireAuth(request);
  if (!requireRole(payload, "admin", "manager")) {
    throw APIError.Forbidden("No permission to access this endpoint");
  }
  const newSpace = await Space.create(body);
  const space = sanitizeSpace(newSpace);
  return APIResponse.success("New space added successfuly", { space }, 201);
});
