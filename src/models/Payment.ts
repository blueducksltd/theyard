import { Schema, models, model, Types } from "mongoose";
import {
    IPayment,
    IPaymentMethods,
    IPaymentModel
} from "../types/Payment";

// Schema definition with TS generics
const PaymentSchema = new Schema<IPayment, IPaymentModel, IPaymentMethods>(
    {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        email: { type: String, required: true },
        booking: {
            type: Types.ObjectId,
            ref: "Booking",
            required: true
        },
        reference: { type: String, required: true },
        paystackId: { type: String, required: true }
    },
    { timestamps: true }
);

PaymentSchema.statics.filter = async function (
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
const Payment =
    (models.Payment as IPaymentModel) ||
    model<IPayment, IPaymentModel>("Payment", PaymentSchema);


export default Payment;