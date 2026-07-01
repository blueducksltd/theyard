import { NextRequest } from "next/server";
import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import AddOn from "@/models/AddOn";
import { CreateAddOnDTO, CreateAddOnInput, SafeAddOn, sanitizeAddOn } from "@/types/AddOn";

export const POST = errorHandler(async (request: NextRequest) => {
  await connectDB();
  const payload = requireAuth(request);

  const isPermitted = await requireRole(payload, "admin", "manager");
  if (!isPermitted) {
    throw APIError.Forbidden("No permission to access this endpoint");
  }

  const body: CreateAddOnInput = await request.json();
  const data = CreateAddOnDTO.parse(body);

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
