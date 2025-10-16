import APIResponse from "@/lib/APIResponse";
import { connectDB } from "@/lib/db";
import { errorHandler } from "@/lib/errors/ErrorHandler";
import { sendNotification } from "@/lib/notification";
import Review from "@/models/Review";
import { CreateReviewDTO, CreateReviewInput, sanitizeReview } from "@/types/Review";
import { NextRequest } from "next/server";

export const POST = errorHandler(
    async (request: NextRequest) => {
        await connectDB();

        const body: CreateReviewInput = await request.json();
        const data = CreateReviewDTO.parse(body);

        const newReview = await Review.create(data);

        if (!newReview) throw new Error("Failed to create review");
        const sanitizedReview = sanitizeReview(newReview);

        await sendNotification({
            type: "review",
            title: "New Review",
            message: `Received a new review from ${newReview.name}`,
            permission: 3,
            meta: { review: newReview }
        });

        return APIResponse.success("Review created successfully", { review: sanitizedReview }, 201);
    }
);

export const GET = errorHandler(async (request: NextRequest) => {
    await connectDB();

    // --- Query Params ---
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const sort = searchParams.get("sort") || "createdAt";
    const direction = (searchParams.get("direction") as "ASC" | "DESC") || "ASC";
    const page = parseInt(searchParams.get("page") || "1", 10);

    // Handle limit: if not provided, return all results (no pagination)
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : null;

    // --- Filtering ---
    const filter = {};
    if (status) Object.assign(filter, { status });

    // --- Fetch Reviews ---
    const reviews = await Review.filter(filter, sort, direction);
    if (!reviews || reviews.length === 0)
        return APIResponse.success("No reviews found", { reviews: [] });

    // --- Pagination Logic ---
    let paginatedReviews = reviews;
    let pagination = undefined;

    if (limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        paginatedReviews = reviews.slice(startIndex, endIndex);

        pagination = {
            currentPage: page,
            totalPages: Math.ceil(reviews.length / limit),
            pageSize: limit,
            totalItems: reviews.length,
            nextPage: endIndex < reviews.length ? page + 1 : null,
            prevPage: startIndex > 0 ? page - 1 : null,
        };
    }

    // --- Sanitize & Respond ---
    const sanitizedReviews = paginatedReviews.map((review) => sanitizeReview(review));

    return APIResponse.success("Reviews retrieved successfully", {
        reviews: sanitizedReviews,
        pagination,
    });
});
