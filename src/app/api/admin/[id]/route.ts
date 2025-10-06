import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Admin from "@/models/Admin";
import { UpdateAdminDto, UpdateAdminInput, sanitizeAdmin } from "@/types/Admin";
import { NextRequest } from "next/server";

export const PUT = errorHandler<{ params: { id: string } }>(
    async (request: NextRequest, context) => {
        await connectDB();
        const { id } = await context.params;

        const payload = requireAuth(request);
        const isPermitted = await requireRole(payload, "admin");

        if (!isPermitted) {
            throw APIError.Forbidden("No permission to access this endpoint")
        }

        const body: UpdateAdminInput = await request.json();
        const data = UpdateAdminDto.parse(body);

        const updated = await Admin.findByIdAndUpdate(id, data, { new: true });
        if (!updated) throw APIError.NotFound(`Admin with id: ${id} not found`);

        return APIResponse.success("Admin updated successfully", { admin: sanitizeAdmin(updated) });
    }
);

export const DELETE = errorHandler<{ params: { id: string } }>(
    async (request: NextRequest, context) => {
        await connectDB();
        const payload = requireAuth(request);
        const isPermitted = await requireRole(payload, "admin");

        if (!isPermitted) {
            throw APIError.Forbidden("No permission to access this endpoint")
        }
        const { id } = await context.params;

        const admin = await Admin.findById(id);
        if (!admin) throw APIError.NotFound(`Admin with id: ${id} not found`);

        await Admin.findByIdAndDelete(id);
        return APIResponse.success('Admin Deleted', undefined);
    }
);
