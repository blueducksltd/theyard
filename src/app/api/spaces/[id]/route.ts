import APIResponse from "@/lib/APIResponse";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Space from "@/models/Space";
import { ISpace, sanitizeSpace, UpdateSpaceDTO } from "@/types/Space";
import { NextRequest } from "next/server";

export const PUT = errorHandler<{ params: { id: string } }>(
  async (request: NextRequest, context) => {
    await connectDB();
    requireAuth(request);
    const { id } = await context.params;

    const space = await Space.findById(id);
    if (!space) throw APIError.NotFound(`Space with id: ${id} not found`);

    const contentType = request.headers.get("content-type") ?? "";
    const updates: { name?: string; guestLimit?: number } = {};

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const name = form.get("name") as string | null;
      if (name) updates.name = name;
      const guestLimitStr = form.get("guestLimit") as string | null;
      if (guestLimitStr) updates.guestLimit = Number(guestLimitStr);
    } else if (contentType.includes("application/json")) {
      const json = await request.json();
      if (json.name) updates.name = json.name;
      if (json.guestLimit !== undefined) updates.guestLimit = Number(json.guestLimit);
    } else {
      throw APIError.BadRequest("Content-Type must be multipart/form-data or application/json");
    }

    // Validate with Zod
    const validated = UpdateSpaceDTO.parse(updates);

    const updated = await Space.findByIdAndUpdate(id, validated, {
      new: true,
      runValidators: false,
    });

    return APIResponse.success(
      "Space updated successfully",
      { space: sanitizeSpace(updated as ISpace) },
      200
    );
  }
);

export const DELETE = errorHandler<{ params: { id: string } }>(
  async (request: NextRequest, context) => {
    await connectDB();
    requireAuth(request);
    const { id } = await context.params;

    const space = await Space.findById(id);
    if (!space) throw APIError.NotFound(`Space with id: ${id} not found`);

    await Space.findByIdAndDelete(id);

    return APIResponse.success("Space deleted", undefined, 200);
  }
);