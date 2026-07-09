import { NextRequest } from "next/server";
import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import AddOn from "@/models/AddOn";
import { CreateAddOnDTO, CreateAddOnInput, SafeAddOn, sanitizeAddOn } from "@/types/AddOn";
import { uploadImage } from "@/lib/vercel";
import { z } from "zod";

export const POST = errorHandler(async (request: NextRequest) => {
  await connectDB();
  const payload = requireAuth(request);

  const isPermitted = await requireRole(payload, "admin", "manager");
  if (!isPermitted) {
    throw APIError.Forbidden("No permission to access this endpoint");
  }

  const contentType = request.headers.get("content-type") ?? "";

  let body: CreateAddOnInput;
  let imageUrl: string | undefined;

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("image") as File | null;

    imageUrl = file ? await uploadImage(file) : undefined;

    body = {
      name: form.get("name") as string,
      category: form.get("category") as CreateAddOnInput["category"],
      description: (form.get("description") as string | null) || undefined,
      price: form.get("price") ? z.coerce.number().parse(form.get("price")) : undefined,
      pricePerMin: form.get("pricePerMin") ? z.coerce.number().parse(form.get("pricePerMin")) : undefined,
    };
  } else {
    body = await request.json();
  }

  const data = CreateAddOnDTO.parse({ ...body, imageUrl });

  const newAddOn = await AddOn.create(data);
  const sanitized = sanitizeAddOn(newAddOn);

  return APIResponse.success("New add-on created successfully", { addOn: sanitized }, 201);
});

export const GET = errorHandler(async (request: NextRequest) => {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const filter: Record<string, string> = {};
  if (category) {
    filter.category = category;
  }

  const addOns = await AddOn.find(filter).sort({ category: 1, name: 1 });
  const safeAddOns: SafeAddOn[] = addOns.map((addOn) => sanitizeAddOn(addOn));

  return APIResponse.success("Fetched add-ons successfully", { addOns: safeAddOns }, 200);
});
