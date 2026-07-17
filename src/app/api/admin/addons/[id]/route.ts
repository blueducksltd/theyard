import { NextRequest } from "next/server";
import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import { deleteImage, uploadImage } from "@/lib/vercel";
import AddOn from "@/models/AddOn";
import { CreateAddOnDTO, UpdateAddOnDTO, UpdateAddOnInput, sanitizeAddOn } from "@/types/AddOn";

function parseOptionalNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

export const PUT = errorHandler<{ params: { id: string } }>(async (request: NextRequest, context) => {
  await connectDB();

  const payload = requireAuth(request);
  const isPermitted = await requireRole(payload, "admin", "manager");
  if (!isPermitted) {
    throw APIError.Forbidden("No permission to access this endpoint");
  }

  const { id } = await context.params;
  const existing = await AddOn.findById(id);
  if (!existing) throw APIError.NotFound("Add-on not found");

  const contentType = request.headers.get("content-type") ?? "";
  let body: UpdateAddOnInput;
  let nextImageUrl: string | undefined;

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("image") as File | null;

    nextImageUrl = file ? await uploadImage(file) : undefined;

    body = {
      name: (form.get("name") as string) || undefined,
      category: (form.get("category") as UpdateAddOnInput["category"]) || undefined,
      description: (form.get("description") as string) || undefined,
      price: parseOptionalNumber(form.get("price")),
      pricePerMin: parseOptionalNumber(form.get("pricePerMin")),
      imageUrl: nextImageUrl,
    };
  } else {
    const payloadBody = (await request.json()) as UpdateAddOnInput;
    body = {
      ...payloadBody,
      price: parseOptionalNumber(payloadBody.price),
      pricePerMin: parseOptionalNumber(payloadBody.pricePerMin),
    };
  }

  const data = UpdateAddOnDTO.parse(body);

  const category = data.category ?? existing.category;
  const merged = {
    name: data.name ?? existing.name,
    category,
    description: data.description ?? existing.description,
    price: category !== "game" ? data.price ?? existing.price : undefined,
    pricePerMin: category === "game" ? data.pricePerMin ?? existing.pricePerMin : undefined,
    imageUrl: data.imageUrl ?? existing.imageUrl,
  };

  CreateAddOnDTO.parse({
    ...merged,
    imageUrl: merged.imageUrl,
  });

  if (data.imageUrl && existing.imageUrl) {
    await deleteImage(existing.imageUrl);
  }

  const updated = await AddOn.findByIdAndUpdate(id, merged, { new: true });
  if (!updated) throw APIError.NotFound("Add-on not found");

  return APIResponse.success("Add-on updated successfully", { addOn: sanitizeAddOn(updated) }, 200);
});

export const DELETE = errorHandler<{ params: { id: string } }>(async (request: NextRequest, context) => {
  await connectDB();

  const payload = requireAuth(request);
  const isPermitted = await requireRole(payload, "admin", "manager");
  if (!isPermitted) {
    throw APIError.Forbidden("No permission to access this endpoint");
  }

  const { id } = await context.params;
  const existing = await AddOn.findById(id);
  if (!existing) throw APIError.NotFound("Add-on not found");

  if (existing.imageUrl) {
    await deleteImage(existing.imageUrl);
  }

  await AddOn.findByIdAndDelete(id);

  return APIResponse.success("Add-on deleted successfully", { id }, 200);
});
