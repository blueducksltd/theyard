import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Package from "@/models/Package";
import { CreatePackageDTO, CreatePackageInput, sanitizePackage } from "@/types/Package";
import { NextRequest } from "next/server";

export const POST = errorHandler(
    async (request: NextRequest) => {
        await connectDB();
        const body: CreatePackageInput = await request.json()
        const payload = requireAuth(request)

        if (!requireRole(payload, "admin", "manager")) {
            throw APIError.Forbidden("No permission to access this endpoint")
        }

        const data = CreatePackageDTO.parse(body);
        const newPackage = await Package.create(data);
        const _package = sanitizePackage(newPackage)
        return APIResponse.success("New package added successfuly", { package: _package }, 201);
    }
)

export const GET = errorHandler(async (request: NextRequest) => {
    await connectDB();

    const packages = await Package.find();
    const safePackages = packages.map((_package) => sanitizePackage(_package));

    return APIResponse.success("fetched all packages", { packages: safePackages }, 200);
});
