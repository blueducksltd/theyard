import APIResponse from "@/lib/APIResponse";
import { requireAuth, requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import { inviteAdminEmail } from "@/lib/mailer";
import { sendNotification } from "@/lib/notification";
import Admin from "@/models/Admin";
import { CreateAdminDto, CreateAdminInput, sanitizeAdmin } from "@/types/Admin";
import { NextRequest } from "next/server";


export const POST = errorHandler(
    async (request: NextRequest) => {
        await connectDB();

        const payload = requireAuth(request);
        const isPermitted = await requireRole(payload, "admin");

        if (!isPermitted) {
            throw APIError.Forbidden("No permission to access this endpoint")
        }

        const body: CreateAdminInput = await request.json();

        // Generate a random 8-character alphanumeric password        
        body.password = Array.from({ length: 8 }, () =>
            Math.random().toString(36).charAt(2 + Math.floor(Math.random() * 10))
        ).join("");
        const data = CreateAdminDto.parse(body);

        const adminExists = await Admin.findByEmail(data.email);

        if (adminExists) {
            throw APIError.Conflict("Admin already exist")
        }


        const newAdmin = await Admin.create(data);
        if (newAdmin) await inviteAdminEmail(newAdmin, body.password);
        await sendNotification({
            type: "admin",
            title: "New Admin",
            message: "New Admin Just joined the team",
            permission: 1,
            meta: { admin: newAdmin }
        })

        return APIResponse.success("New admin created with success", { admin: sanitizeAdmin(newAdmin) }, 201);
    }
);

export const GET = errorHandler(async () => {
    await connectDB();
    const admins = await Admin.find();
    const sanitized = admins.map(sanitizeAdmin);
    return APIResponse.success('fetched all admins', { admins: sanitized });
});