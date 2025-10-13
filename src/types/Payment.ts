import { Document, Model } from "mongoose";
// import z from "zod";
import { IBooking, SafeBooking, sanitizeBooking } from "./Booking";

// Document fields
export interface IPayment extends Document {
    amount: number;
    name: string;
    email: string;
    booking: IBooking["id"];
    reference: string;
    paystackId: string;
}

// Instance methods
export interface IPaymentMethods {
    getBooking(): Promise<IBooking | null>;
}

// Statics
export interface IPaymentModel extends Model<IPayment, IPaymentMethods> {
    filter(filter: Record<string, string>, sort: string, direction: "ASC" | "DESC", admin?: boolean): Promise<IPayment[]>;
}

// Utility Types
export type SafePayment = {
    id: string;
    name: string;
    amount: number;
    email: string;
    booking: SafeBooking | null;
}

export const sanitizePayment = (payment: IPayment): SafePayment => {
    return {
        id: payment.id,
        name: payment.name,
        amount: payment.amount,
        email: payment.email,
        booking: payment.booking ? sanitizeBooking(payment.booking) : null,
    }
}

// export const CreatePaymentDTO = z.object({
//     reference: z.string()
// });

// export const UpdatePaymentDTO = z.object({
//     name: z.string().optional()
// });

// export type CreatePaymentInput = z.infer<typeof CreatePaymentDTO>;
// export type UpdatePaymentInput = z.infer<typeof UpdatePaymentDTO>;