import APIResponse from "@/lib/APIResponse";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import { deleteImage, uploadImage } from "@/lib/vercel";
import Space from "@/models/Space";
import { ISpace, sanitizeSpace, UpdateSpaceDTO, UpdateSpaceInput } from "@/types/Space";
import { NextRequest } from "next/server";
import z from "zod";

export const PUT = errorHandler<{ params: { id: string } }>(
    async (request: NextRequest, context) => {
        await connectDB();
        requireAuth(request);
        const { id } = await context.params;

        const space = await Space.findById(id);
        if (!space) throw APIError.NotFound(`Space with id: ${id} not found`);

        const contentType = request.headers.get("content-type") ?? "";
        if (!contentType.includes("multipart/form-data")) {
            throw APIError.BadRequest("Content-Type must be multipart/form-data");
        }

        const form = await request.formData();
        const file = form.get("image") as File | null;

        const data: Partial<UpdateSpaceInput> = {};

        const name = form.get("name") as string | null;
        if (name) data.name = name;

        const description = form.get("description") as string | null;
        if (description) data.description = description;

        const priceStr = form.get("pricePerHour") as string | null;
        if (priceStr) data.pricePerHour = z.coerce.number().parse(priceStr);

        const specsString = form.get("specs") as string | null;
        if (specsString) {
            const specs = specsString
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
            data.specs = specs;
        }

        if (file) {
            // delete old one only if new one uploaded
            await deleteImage(space.imageUrl);
            data.imageUrl = await uploadImage(file);
        }

        // Merge existing data with new updates
        const updatedData = { ...space.toObject(), ...data };

        // Validate merged data with Zod
        const validated = UpdateSpaceDTO.parse(updatedData);

        const updated = await Space.findByIdAndUpdate(id, validated, { new: true });

        return APIResponse.success(
            `Space updated successfully`,
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

        await deleteImage(space.imageUrl);
        await Space.findByIdAndDelete(id);

        return APIResponse.success(`Space deleted`, undefined, 200)
    }
);