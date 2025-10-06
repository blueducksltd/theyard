import APIResponse from "@/lib/APIResponse";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import Review from "@/models/Review";
import { UpdateReviewDTO } from "@/types/Review";
import { NextRequest } from "next/server";

export const PUT = errorHandler<{ params: { id: string } }>(
    async (request: NextRequest, context) => {
        await connectDB();
        requireAuth(request);
        const { id } = await context.params;
        const body = await request.json();
        const data = UpdateReviewDTO.parse(body);

        let updated;

        if (body.affect && body.affect == "all") {
            updated = await Review.updateMany({ status: "pending" }, { $set: data })
        } else {
            updated = await Review.findByIdAndUpdate(id, data, { new: true });
        }
        if (!updated) throw APIError.NotFound(`Review with id: ${id} not found`);

        return Response.json({
            message: "Review updated successfully",
            review: updated,
        });
    }
);

export const DELETE = errorHandler<{ params: { id: string } }>(
    async (request: NextRequest, context) => {
        await connectDB();
        requireAuth(request);
        const { id } = await context.params;

        const review = await Review.findById(id);
        if (!review) throw APIError.NotFound(`Review with id: ${id} not found`);

        await Review.findByIdAndDelete(id);
        return APIResponse.success(`Review deleted`, undefined, 200);
    }
);
