import { errorHandler } from "@/lib/errors/ErrorHandler";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import APIResponse from "@/lib/APIResponse";
import APIError from "@/lib/errors/APIError";

export const POST = errorHandler(async (request) => {
    await connectDB();
    const payload = requireAuth(request);
    // Set admin status to inactive
    const admin = await Admin.findByIdAndUpdate(payload.id, { status: "inactive" }, { new: true });
    if (!admin) {
        throw APIError.NotFound("Admin not found");
    }
    return APIResponse.success("Logged out successfully", undefined);
});
