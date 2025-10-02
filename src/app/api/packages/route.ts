import { NextRequest } from "next/server";
import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Package from "@/models/Package";
import { CreatePackageDTO, SafePackage, sanitizePackage } from "@/types/Package";
import { z } from "zod";

// Infer input type from DTO for type safety
type PackageInput = z.infer<typeof CreatePackageDTO>;

export const POST = errorHandler(async (request: NextRequest) => {
    await connectDB();
    const payload = requireAuth(request);

    if (!requireRole(payload, "admin", "manager")) {
        throw APIError.Forbidden("No permission to access this endpoint");
    }

    const contentType = request.headers.get("content-type") ?? "";
    let body: Partial<PackageInput> = {};
    let file: File | null = null;

    if (contentType.includes("multipart/form-data")) {
        const form = await request.formData();

        for (const [key, value] of form.entries()) {
            if (key === "image" && value instanceof File) {
                file = value;
            } else {
                body[key as keyof PackageInput] = value.toString() as any;
            }
        }
    } else {
        // request.json() returns unknown by default, safe to cast
        body = (await request.json()) as Partial<PackageInput>;
    }

    const imageUrl = file ? await uploadToCloudinary(file) : undefined;

    // Validate & coerce with Zod
    const data = CreatePackageDTO.parse({
        ...body,
        imageUrl,
    });

    const newPackage = await Package.create(data);
    const sanitized = sanitizePackage(newPackage);

    return APIResponse.success(
        "New package added successfully",
        { package: sanitized },
        201
    );
});

export const GET = errorHandler(async () => {
    await connectDB();

    const packages = await Package.find();
    const safePackages: SafePackage[] = packages.map((pkg) => sanitizePackage(pkg));

    return APIResponse.success(
        "Fetched all packages",
        { packages: safePackages },
        200
    );
});
