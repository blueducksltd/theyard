import { NextRequest } from "next/server";
import Admin from "@/models/Admin";
import { randomInt } from "crypto";
import { differenceInSeconds, addMinutes, isAfter } from "date-fns";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import APIError from "@/lib/errors/APIError";
import APIResponse from "@/lib/APIResponse";
import { sendConfirmationEmail } from "@/lib/mailer";

// ==================== POST — SEND CODE ====================
export const POST = errorHandler(async (request: NextRequest) => {
    await connectDB();

    const payload = requireAuth(request);
    const admin = await Admin.findById(payload.id);
    if (!admin) throw APIError.NotFound("Admin not found");
    if (admin.emailVerifiedAt) return APIResponse.success("email has been verified", undefined)

    const now = new Date();

    if (admin.emailVerificationLastSent) {
        const secondsPassed = differenceInSeconds(now, admin.emailVerificationLastSent);
        if (secondsPassed < 60) {
            throw APIError.BadRequest(
                `Please wait ${60 - secondsPassed}s before requesting another code`
            );
        }
    }

    const code = randomInt(1000, 9999).toString();

    admin.emailVerificationCode = code;
    admin.emailVerificationExpires = addMinutes(now, 10); // expires in 10 mins
    admin.emailVerificationLastSent = now;
    await admin.save();

    await sendConfirmationEmail(
        admin.email,
        code
    );

    return APIResponse.success("Verification code sent to your email", undefined);
});

// ==================== GET — VERIFY CODE ====================
export const GET = errorHandler(async (request: NextRequest) => {
    await connectDB();

    const payload = requireAuth(request);
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) throw APIError.BadRequest("Verification code is required");

    const admin = await Admin.findById(payload.id);
    if (!admin) throw APIError.NotFound("Admin not found");

    const now = new Date();

    if (
        admin.emailVerificationCode !== code ||
        !admin.emailVerificationExpires ||
        isAfter(now, admin.emailVerificationExpires)
    ) {
        throw APIError.BadRequest("Invalid or expired verification code");
    }

    admin.emailVerificationCode = null;
    admin.emailVerificationExpires = null;
    admin.emailVerificationLastSent = null;
    admin.emailVerifiedAt = now;
    await admin.save();

    return APIResponse.success("Email verified successfully", undefined);
});
