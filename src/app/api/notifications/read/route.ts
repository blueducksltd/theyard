import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Admin from "@/models/Admin";
import Notification from "@/models/Notification";
import { sanitizeNotification } from "@/types/Notification";
import { NextRequest } from "next/server";

export const POST = errorHandler(async (request: NextRequest) => {
    await connectDB();
    const payload = requireAuth(request);

    if (!requireRole(payload, "admin", "manager")) {
        throw APIError.Forbidden("No permission to access this endpoint");
    }

    const admin = await Admin.findById(payload.id);
    if (!admin) {
        return Response.json({ error: "Admin not found" }, { status: 404 });
    }

    const { id } = await request.json();

    if (!id) throw APIError.BadRequest("please specify id");

    let notifications;

    if (id === "all") {
        // Update all matching notifications
        await Notification.updateMany(
            { permission: { $in: admin.permissions } },
            { $addToSet: { readBy: admin.id } } // Prevent duplicates
        );

        // Refetch updated notifications to return sanitized versions
        notifications = await Notification.find({
            permission: { $in: admin.permissions }
        });
    } else {
        // Update a single notification
        const updated = await Notification.findByIdAndUpdate(
            id,
            { $addToSet: { readBy: admin.id } },
            { new: true }
        );

        if (!updated) {
            throw APIError.NotFound("Notification not found");
        }

        notifications = [updated];
    }

    const sanitized = notifications.map((n) => sanitizeNotification(n, admin.id));

    return APIResponse.success("Notifications marked as read", {
        notifications: sanitized,
    });
});
