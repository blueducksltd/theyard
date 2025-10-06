import { NextRequest } from "next/server";
import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Service from "@/models/Service";
import { CreateServiceDTO, CreateServiceInput, SafeService, sanitizeService } from "@/types/Service";


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

    const body: CreateServiceInput = {
        name: form.get("name") as string,
        description: form.get("description") as string || undefined,
    };

    const imageUrl = file ? await uploadToCloudinary(file) : undefined;

    // Validate & coerce with Zod
    const data = CreateServiceDTO.parse({
        ...body,
        imageUrl,
    });

    const newService = await Service.create(data);
    const sanitized = sanitizeService(newService);

    return APIResponse.success(
        "New Service added successfully",
        { service: sanitized },
        201
    );
});

export const GET = errorHandler(async () => {
    await connectDB();

    const Services = await Service.find();
    const safeServices: SafeService[] = Services.map((pkg) => sanitizeService(pkg));

    return APIResponse.success(
        "Fetched all Services",
        { services: safeServices },
        200
    );
});
