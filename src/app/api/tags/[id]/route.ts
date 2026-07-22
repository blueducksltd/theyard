import APIResponse from "@/lib/APIResponse";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Gallery from "@/models/Gallery";
import Tag from "@/models/Tag";
import { sanitizeTag, UpdateTagDTO, UpdateTagInput } from "@/types/Tag";
import { NextRequest } from "next/server";

export const PUT = errorHandler<{ params: { id: string } }>(async (request: NextRequest, context) => {
  await connectDB();

  requireAuth(request);

  const { id } = await context.params;
  const tag = await Tag.findById(id);
  if (!tag) throw APIError.NotFound("Tag not found");

  const body: UpdateTagInput = await request.json();
  const data = UpdateTagDTO.parse(body);

  const nextName = data.name?.trim().toLowerCase();
  if (!nextName) throw APIError.BadRequest("Tag name is required");

  const duplicateTag = await Tag.findOne({ name: nextName, _id: { $ne: id } });
  if (duplicateTag) throw APIError.Conflict(`Tag by name ${nextName} already exists`);

  const previousName = tag.name;
  tag.name = nextName;
  await tag.save();

  if (previousName !== nextName) {
    await Gallery.updateMany({ category: previousName }, { $set: { category: nextName } });
  }

  return APIResponse.success("Tag updated successfully", { tag: sanitizeTag(tag) }, 200);
});

export const DELETE = errorHandler<{ params: { id: string } }>(async (request: NextRequest, context) => {
  await connectDB();

  requireAuth(request);

  const { id } = await context.params;
  const tag = await Tag.findById(id);
  if (!tag) throw APIError.NotFound("Tag not found");

  const linkedGalleryCount = await Gallery.countDocuments({ category: tag.name });
  if (linkedGalleryCount > 0) {
    throw APIError.BadRequest(`Cannot delete tag '${tag.name}' because it is used by ${linkedGalleryCount} gallery item(s)`);
  }

  await Tag.findByIdAndDelete(id);

  return APIResponse.success("Tag deleted successfully", { id }, 200);
});
