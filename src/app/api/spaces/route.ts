import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Space from "@/models/Space";
import { CreateSpaceDto, sanitizeSpace } from "@/types/Space";
import { NextRequest } from "next/server";

export const POST = errorHandler(async (request: NextRequest) => {
  await connectDB();

  const payload = requireAuth(request);
  if (!requireRole(payload, "admin", "manager")) {
    throw APIError.Forbidden("No permission to access this endpoint");
  }

  const contentType = request.headers.get("content-type") ?? "";

  let name = "";
  let guestLimit = 50;

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    name = (form.get("name") as string) ?? "";
    const raw = form.get("guestLimit");
    guestLimit = raw ? Number(raw) : 50;
  } else if (contentType.includes("application/json")) {
    const json = await request.json();
    name = json.name ?? "";
    guestLimit = json.guestLimit ? Number(json.guestLimit) : 50;
  } else {
    throw APIError.BadRequest("Content-Type must be multipart/form-data or application/json");
  }

  // Validate with Zod
  const data = CreateSpaceDto.parse({ name, guestLimit });

  const newSpace = await Space.create(data);
  const sanitized = sanitizeSpace(newSpace);

  return APIResponse.success("New space added successfully", { space: sanitized }, 201);
});

export const GET = errorHandler(async () => {
  await connectDB();
  const spaces = await Space.find().sort({ createdAt: -1 });
  const sanitizedSpaces = spaces.map(sanitizeSpace);
  return APIResponse.success("Fetched all spaces", { spaces: sanitizedSpaces });
});