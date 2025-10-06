import { NextRequest, NextResponse } from "next/server";
import Admin from "@/models/Admin";
import { LoginAdminDto, sanitizeAdmin } from "@/types/Admin";
import { generateToken } from "@/lib/auth";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import APIError from "@/lib/errors/APIError";
import { connectDB } from "@/lib/db";

export const POST = errorHandler(
    async (req: NextRequest) => {
        await connectDB();

        const body = await req.json();
        const parsed = LoginAdminDto.parse(body);

        const admin = await Admin.findByEmail(parsed.email);
        if (!admin) {
            throw APIError.BadRequest("Invalid email or password");
        }

        const isMatch = await admin.comparePassword(parsed.password);

        if (!isMatch) {
            throw APIError.Unauthorized("Invalid email or password");
        }

        const token = generateToken(admin);
        admin.status = "active";
        await admin.save();

        return NextResponse.json({
            success: true,
            message: "Login successful",
            data: {
                admin: sanitizeAdmin(admin),
                token
            },
        });
    }
)