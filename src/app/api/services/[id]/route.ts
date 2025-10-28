import APIResponse from "@/lib/APIResponse";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import { deleteImage, uploadImage } from "@/lib/vercel";
import Service from "@/models/Service";
import { IService, sanitizeService, UpdateServiceDTO, UpdateServiceInput } from "@/types/Service";
import { NextRequest } from "next/server";

export const PUT = errorHandler<{ params: { id: string } }>(
    async (request: NextRequest, context) => {
        await connectDB();
        requireAuth(request);
        const { id } = await context.params;

        const service = await Service.findById(id);
        if (!service) throw APIError.NotFound(`Service with id: ${id} not found`);

        const contentType = request.headers.get("content-type") ?? "";
        if (!contentType.includes("multipart/form-data")) {
            throw APIError.BadRequest("Content-Type must be multipart/form-data");
        }

        const form = await request.formData();
        const file = form.get("image") as File | null;

        const data: Partial<UpdateServiceInput> = {};

        const name = form.get("name") as string | null;
        if (name) data.name = name;

        const description = form.get("description") as string | null;
        if (description) data.description = description;

        if (file) {
            // delete old one only if new one uploaded
            await deleteImage(service.imageUrl);
            data.imageUrl = await uploadImage(file);
        }

        // Merge existing data with new updates
        const updatedData = { ...service.toObject(), ...data };

        // Validate merged data with Zod
        const validated = UpdateServiceDTO.parse(updatedData);

        const updated = await Service.findByIdAndUpdate(id, validated, { new: true });

        return APIResponse.success(
            `Service updated successfully`,
            { service: sanitizeService(updated as IService) },
            200
        );
    }
);


export const DELETE = errorHandler<{ params: { id: string } }>(
    async (request: NextRequest, context) => {
        await connectDB();
        requireAuth(request);
        const { id } = await context.params;

        const service = await Service.findById(id);
        if (!service) throw APIError.NotFound(`Service with id: ${id} not found`);

        await deleteImage(service.imageUrl);
        await Service.findByIdAndDelete(id);

        return APIResponse.success(`Service deleted`, undefined, 200)
    }
);