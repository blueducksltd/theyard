import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import APIError from "@/lib/errors/APIError";
import APIResponse from "@/lib/APIResponse";
import { requireAuth } from "@/lib/auth";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { UpdatePasswordDTO, UpdatePasswordInput } from "@/types/Admin";

// -------------------------------
// Route handler
// -------------------------------
export const POST = errorHandler(async (request: NextRequest) => {
    await connectDB();
    const payload = requireAuth(request); // ensures logged in admin

    const body: UpdatePasswordInput = await request.json();
    const data = UpdatePasswordDTO.parse(body);

    // Fetch admin from DB
    const admin = await Admin.findById(payload.id);
    if (!admin) throw APIError.NotFound("Admin not found");

    // Validate current password
    const isMatch = await bcrypt.compare(data.currentPassword, admin.password);
    if (!isMatch) throw APIError.BadRequest("Current password is incorrect");

    // Update admin password
    admin.password = data.newPassword;
    await admin.save();

    return APIResponse.success("Password updated successfully", undefined, 200);
});
