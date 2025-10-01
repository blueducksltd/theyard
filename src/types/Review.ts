import { Document, Model } from "mongoose";
import z from "zod";
import { ICustomer } from "./Customer";

// Document fields
export interface IReview extends Document {
    name: string;
    comment: string;
    status: "pending" | "published" | "ignored";
    location: string;
    createdAt: Date;
    updatedAt: Date;
}

// Instance methods
export interface IReviewMethods {
    getReviewOwner(): Promise<ICustomer | null>;
}

// Statics
export interface IReviewModel extends Model<IReview> {
    filter(filter: Record<string, string>, sort: string, direction: "ASC" | "DESC", admin?: boolean): Promise<IReview[]>;
}

// Utility Types
export type SafeReview = {
    name: string;
    comment: string;
    status: IReview["status"];
    location: string;
    createdAt: Date
}

export const sanitizeReview = (review: IReview): SafeReview => {
    return {
        name: review.name,
        comment: review.comment,
        status: review.status,
        location: review.location,
        createdAt: review.createdAt
    }
}

export const CreateReviewDTO = z.object({
    name: z.string(),
    comment: z.string().max(200),
    location: z.string()
});

export type CreateReviewInput = z.infer<typeof CreateReviewDTO>;
