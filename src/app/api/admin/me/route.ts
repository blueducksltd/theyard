import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import { IAdmin, sanitizeAdmin, UpdateAdminDto, UpdateAdminInput } from "@/types/Admin";
import APIResponse from "@/lib/APIResponse";
import APIError from "@/lib/errors/APIError";
import { NextRequest } from "next/server";
import z from "zod";
import { deleteImage, uploadImage } from "@/lib/vercel";

export const GET = errorHandler(
    async (request: NextRequest) => {
        await connectDB();
        const payload = requireAuth(request);
        const admin = await Admin.findById(payload.id);
        if (!admin) {
            throw APIError.NotFound("Admin not found");
        }

        const sanitizedAdmin = sanitizeAdmin(admin);

        return APIResponse.success(
            `fetched logged in admin`,
            { admin: sanitizedAdmin }
        )
    }
);


// PUT - Settings

export const PUT = errorHandler(async (request: NextRequest) => {
    await connectDB();
    const payload = requireAuth(request);

    const admin = await Admin.findById(payload.id);
    if (!admin) throw APIError.NotFound("Admin Not found")

    const form = await request.formData();
    const file = form.get("image") as File | null;

    const data: Partial<UpdateAdminInput> = {};

    const name = form.get("name") as string | null;
    if (name) data.name = name;

    const email = form.get("email") as string | null;
    if (email) data.email = email;

    const phone = form.get("phone") as string | null;
    if (phone) data.phone = phone;

    const role = form.get("role") as "admin" | "manager" | null;
    if (role) data.role = role;

    const password = form.get("password") as string | null;
    if (password) data.password = password;

    const permissions = form.get("permissions") as string | null;
    if (permissions) {
        const perm = permissions
            .split(",")
            .map((s) => z.coerce.number().parse(s))
            .filter(Boolean);
        data.permissions = perm;
    }

    if (file) {
        // delete old one only if new one uploaded
        await deleteImage(admin.imageUrl);
        data.imageUrl = await uploadImage(file);
    }

    // Merge existing data with new updates
    const updatedData = { ...admin.toObject(), ...data };

    // Validate merged data with Zod
    const validated = UpdateAdminDto.parse(updatedData);

    const updated = await Admin.findByIdAndUpdate(admin.id, validated, { new: true });

    return APIResponse.success('Admin Updated successfuly', { admin: sanitizeAdmin(updated as IAdmin) })
});