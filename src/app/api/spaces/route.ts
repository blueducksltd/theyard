import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Space from "@/models/Space";
// import { CreateBookingDto } from "@/types/Booking";
import { CreateSpaceDto, CreateSpaceInput, sanitizeSpace } from "@/types/Space";
import { NextRequest } from "next/server";
import z from "zod";

export const POST = errorHandler(async (request: NextRequest) => {
  await connectDB();

  const payload = requireAuth(request);
  if (!requireRole(payload, "admin", "manager")) {
    throw APIError.Forbidden("No permission to access this endpoint");
  }
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("multipart/form-data")) {
    throw APIError.BadRequest("Content-Type must be multipart/form-data");
  }
  const form = await request.formData();
  const file = form.get("image") as File | null;

  // convert string seperated by commas to array of strings
  const specsString = form.get("specs") as string;
  const specs = specsString ? specsString.split(",").map(s => s.trim()) : [];

  const body: CreateSpaceInput = {
    name: form.get("name") as string,
    description: form.get("description") as string,
    pricePerHour: z.coerce.number().parse(form.get("price")),
    capacity: z.coerce.number().parse(form.get("capacity")),
    specs,
    address: form.get("address") as string,
  };

  if (!file) throw APIError.BadRequest("Image is required");

  const imageUrl = await uploadToCloudinary(file);

  // Validate & coerce with Zod
  const data = CreateSpaceDto.parse({
    ...body,
    imageUrl,
  });

  const newSpace = await Space.create(data);
  const sanitized = sanitizeSpace(newSpace);

  return APIResponse.success(
    "New space added successfully",
    { space: sanitized },
    201
  );
});

export const GET = errorHandler(
  async () => {
    await connectDB();
    const spaces = await Space.find();
    const sanitizedSpaces = spaces.map(sanitizeSpace)

    return APIResponse.success("Fetched all spaces", { spaces: sanitizedSpaces });
  }
)