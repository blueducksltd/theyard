import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Package from "@/models/Package";
import { CreatePackageDTO, sanitizePackage } from "@/types/Package";
import { NextRequest } from "next/server";

export const POST = errorHandler(async (request: NextRequest) => {
    await connectDB();
    const payload = requireAuth(request);

    if (!requireRole(payload, "admin", "manager")) {
        throw APIError.Forbidden("No permission to access this endpoint");
    }

    const contentType = request.headers.get("content-type") || "";
    let body: Record<string, any> = {};
    let file: File | null = null;

    if (contentType.includes("multipart/form-data")) {
        const form = await request.formData();

        form.forEach((value, key) => {
            if (key === "image" && value instanceof File) {
                file = value;
            } else {
                body[key] = value;
            }
        });
    } else {
        body = await request.json();
    }

    const imageUrl = file ? await uploadToCloudinary(file) : undefined;
    // Parse with Zod
    body.imageUrl = imageUrl;
    const data = CreatePackageDTO.parse(body);

    const newPackage = await Package.create(data);
    const _package = sanitizePackage(newPackage);

    return APIResponse.success(
        "New package added successfully",
        { package: _package },
        201
    );
});

export const GET = errorHandler(async () => {
    await connectDB();

    const packages = await Package.find();
    const safePackages = packages.map((_package) => sanitizePackage(_package));

    return APIResponse.success(
        "fetched all packages",
        { packages: safePackages },
        200
    );
});
