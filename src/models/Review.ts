import { Schema, models, model } from "mongoose";
import {
    IReview,
    IReviewMethods,
    IReviewModel
} from "../types/Review";

// Schema definition with TS generics
const ReviewSchema = new Schema<IReview, IReviewModel, IReviewMethods>(
    {
        name: { type: String, required: true },
        comment: { type: String },
        status: {
            type: String,
            enum: ["pending", "published", "ignored"],
            default: "pending"
        },
        location: { type: String }
    },
    { timestamps: true }
);

ReviewSchema.statics.filter = async function (
    filter: Record<string, string>,
    sort: string,
    direction: "ASC" | "DESC",
    admin?: boolean
) {
    const sortDirection = direction.toUpperCase() === "ASC" ? 1 : -1;

    return admin
        ? this.find(filter).sort({ [sort]: sortDirection })
        : this.find({ status: "published" }).sort({ [sort]: sortDirection });
};


// Export model
const Review =
    (models.Review as IReviewModel) ||
    model<IReview, IReviewModel>("Review", ReviewSchema);


export default Review;