import { NextRequest } from "next/server";
import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
// import { uploadToCloudinary } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Package from "@/models/Package";
import Space from "@/models/Space";
import {
  CreatePackageDTO,
  CreatePackageInput,
  SafePackage,
  sanitizePackage,
} from "@/types/Package";
import { z } from "zod";
import { Types } from "mongoose";
import { uploadImage } from "@/lib/vercel";

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
  const submittedSpace = String(form.get("packageSpace") ?? "").trim();
  let packageSpace = submittedSpace;

  // Support packages submitted by older versions of the dashboard, which sent
  // the space name (for example, "outdoor space") instead of its ObjectId.
  if (!Types.ObjectId.isValid(packageSpace)) {
    const matchingSpace = await Space.findOne({
      name: new RegExp(`^${escapeRegExp(packageSpace)}$`, "i"),
    });

    if (!matchingSpace) {
      throw APIError.BadRequest("Please select a valid space before adding this package.");
    }

    packageSpace = matchingSpace.id;
  }

  const body: CreatePackageInput = {
    name: form.get("name") as string,
    description: form.get("description") as string,
    price: z.coerce.number().parse(form.get("price")),
    weekendPrice: z.coerce.number().parse(form.get("weekendPrice")),
    capacity: z.coerce.number().parse(form.get("capacity")),
    packageSpace,
    extraGuestFee: z.coerce.number().parse(form.get("extraGuestFee")),
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
