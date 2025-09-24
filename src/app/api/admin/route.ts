import { requireAuth, requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Admin from "@/models/Admin";
import { CreateAdminDto, CreateAdminInput, sanitizeAdmin } from "@/types/Admin";
import { NextRequest, NextResponse } from "next/server";


export const POST = errorHandler(
    async (request: NextRequest) => {
        await connectDB();

        const payload = requireAuth(request);

        if (!requireRole(payload, "admin")) {
            throw APIError.Forbidden("No permission to access this endpoint")
        }

        const body: CreateAdminInput = await request.json();
        const data = CreateAdminDto.parse(body);
        
        const adminExists = await Admin.findByEmail(data.email);

        if (adminExists) {
            throw APIError.Conflict("Admin already exist")
        }
        
        const newAdmin = await Admin.create(data)

        return NextResponse.json({
            success: true,
            message: "New admin created with success",
            data: {
                admin: sanitizeAdmin(newAdmin)
            }
        }, { status: 201 });
    }
)