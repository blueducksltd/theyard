import { Schema, models, model, Types } from "mongoose";
import {
    IInquiry,
    IInquiryMethods,
    IInquiryModel
} from "../types/Inquiry";

// Schema definition with TS generics
const InquirySchema = new Schema<IInquiry, IInquiryModel, IInquiryMethods>(
    {
        customer: { type: Types.ObjectId, ref: "Customer", required: true },
        message: { type: String, required: true }
    },
    { timestamps: true }
);

InquirySchema.statics.filter = async function (
    filter: Record<string, string>,
    sort: string,
    direction: "ASC" | "DESC"
) {
    const sortDirection = direction.toUpperCase() === "ASC" ? 1 : -1;

    return this.find(filter).sort({ [sort]: sortDirection });
};


// Export model
const Inquiry =
    (models.Inquiry as IInquiryModel) ||
    model<IInquiry, IInquiryModel>("Inquiry", InquirySchema);


export default Inquiry;