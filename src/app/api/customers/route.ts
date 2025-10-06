import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Customer from "@/models/Customer";
import { sanitizeCustomer } from "@/types/Customer";
import { NextRequest } from "next/server";

export const GET = errorHandler(async (request: NextRequest) => {
    requireAuth(request);
    await connectDB();
    const customers = await Customer.find();
    const sanitized = customers.map(sanitizeCustomer);
    return Response.json({
        customers: sanitized
    });
});
