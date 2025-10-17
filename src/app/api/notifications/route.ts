import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import Admin from "@/models/Admin";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import { sanitizeNotification } from "@/types/Notification";

export const GET = errorHandler(async (request) => {
    await connectDB();
    const payload = requireAuth(request);
    const admin = await Admin.findById(payload.id);
    if (!admin) {
        return Response.json({ error: "Admin not found" }, { status: 404 });
    }
    // Find notifications where notification.permission is in admin.permissions
    const notifications = await Notification.find({
        permission: { $in: admin.permissions }
    });
    const sanitized = notifications.map(notification => sanitizeNotification(notification, admin.id));
    return Response.json({ notifications: sanitized });
});

