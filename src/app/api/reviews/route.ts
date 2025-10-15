import APIResponse from "@/lib/APIResponse";
import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import APIError from "@/lib/errors/APIError";
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

        await sendNotification({
            type: "review",
            title: "New Review",
            message: `Received a new review from ${newReview.name}`,
            permission: 3,
            meta: { review: newReview }
        });

        return APIResponse.success("Review created successfully", { review: newReview }, 201);
    }
);

export const GET = errorHandler(
    async (request: NextRequest) => {
        await connectDB();
        // const authHeader = request.headers.get("authorization");
        // let admin = false;
        // if (authHeader) {
        //     const payload = requireAuth(request);
        //     // Role is not required, just checking if admin to show all events
        //     if (payload) admin = true;
        // }

        // check query params
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const sort = searchParams.get("sort") || "createdAt";
        const direction = (searchParams.get("direction") as "ASC" | "DESC") || "ASC";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        const filter = {};
        if (status) Object.assign(filter, { status });
        // const reviews = await Review.filter(filter, sort, direction, admin);
        const reviews = await Review.filter(filter, sort, direction);
        if (!reviews) throw APIError.NotFound("No reviews found");

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedReviews = reviews.slice(startIndex, endIndex);
        if (paginatedReviews.length === 0) return APIResponse.success("No reviews found", { reviews: [] });

        const sanitizedReviews = paginatedReviews.map(review => sanitizeReview(review));

        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(reviews.length / limit),
            pageSize: limit,
            totalItems: reviews.length,
            nextPage: endIndex < reviews.length ? page + 1 : null,
            prevPage: startIndex > 0 ? page - 1 : null
        }

        return APIResponse.success("Reviews retrieved successfully", { reviews: sanitizedReviews, pagination });
    }
);