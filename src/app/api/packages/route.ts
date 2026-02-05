import { NextRequest } from "next/server";
import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
// import { uploadToCloudinary } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Package from "@/models/Package";
import {
  CreatePackageDTO,
  CreatePackageInput,
  SafePackage,
  sanitizePackage,
} from "@/types/Package";
import { z } from "zod";
import { uploadImage } from "@/lib/vercel";

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
  const specs = specsString ? specsString.split(",").map((s) => s.trim()) : [];

  const body: CreatePackageInput = {
    name: form.get("name") as string,
    description: form.get("description") as string,
    price: z.coerce.number().parse(form.get("price")),
    extraGuestFee: z.coerce.number().parse(form.get("extraGuestFee")),
    guestLimit: z.coerce.number().parse(form.get("guestLimit")),
    specs,
  };

  // const imageUrl = file ? await uploadToCloudinary(file) : undefined;
  const imageUrl = file ? await uploadImage(file) : undefined;

  // Validate & coerce with Zod
  const data = CreatePackageDTO.parse({
    ...body,
    imageUrl,
  });

  const newPackage = await Package.create(data);
  const sanitized = sanitizePackage(newPackage);

  return APIResponse.success(
    "New package added successfully",
    { package: sanitized },
    201,
  );
});

export const GET = errorHandler(async () => {
  await connectDB();

  const packages = await Package.find();
  const safePackages: SafePackage[] = packages.map((pkg) =>
    sanitizePackage(pkg),
  );

  return APIResponse.success(
    "Fetched all packages",
    { packages: safePackages },
    200,
  );
});
