import APIResponse from "@/lib/APIResponse";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import { deleteImage, uploadImage } from "@/lib/vercel";
import Package from "@/models/Package";
import { IPackage, sanitizePackage, UpdatePackageDTO, UpdatePackageInput } from "@/types/Package";
import { NextRequest } from "next/server";
import z from "zod";

export const PUT = errorHandler<{ params: { id: string } }>(
    async (request: NextRequest, context) => {
        await connectDB();
        requireAuth(request);
        const { id } = await context.params;

        const pkg = await Package.findById(id);
        if (!pkg) throw APIError.NotFound(`Package with id: ${id} not found`);

        const contentType = request.headers.get("content-type") ?? "";
        if (!contentType.includes("multipart/form-data")) {
            throw APIError.BadRequest("Content-Type must be multipart/form-data");
        }

        const form = await request.formData();
        const file = form.get("image") as File | null;

        const data: Partial<UpdatePackageInput> = {};

        const name = form.get("name") as string | null;
        if (name) data.name = name;

        const description = form.get("description") as string | null;
        if (description) data.description = description;

        const priceStr = form.get("price") as string | null;
        if (priceStr) data.price = z.coerce.number().parse(priceStr);

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
            await deleteImage(pkg.imageUrl);
            data.imageUrl = await uploadImage(file);
        }

        // Merge existing data with new updates
        const updatedData = { ...pkg.toObject(), ...data };

        // Validate merged data with Zod
        const validated = UpdatePackageDTO.parse(updatedData);

        const updated = await Package.findByIdAndUpdate(id, validated, { new: true });

        return APIResponse.success(
            `Package updated successfully`,
            { package: sanitizePackage(updated as IPackage) },
            200
        );
    }
);


export const DELETE = errorHandler<{ params: { id: string } }>(
    async (request: NextRequest, context) => {
        await connectDB();
        requireAuth(request);
        const { id } = await context.params;

        const pkg = await Package.findById(id);
        if (!pkg) throw APIError.NotFound(`Package with id: ${id} not found`);

        await deleteImage(pkg.imageUrl);
        await Package.findByIdAndDelete(id);

        return APIResponse.success(`Package deleted`, undefined, 200)
    }
);