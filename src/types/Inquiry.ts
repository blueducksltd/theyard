import { Model } from "mongoose";
import { Document } from "mongoose";
import z from "zod";
import { ICustomer, SafeCustomer, sanitizeCustomer } from "./Customer";

// Document fields
export interface IInquiry extends Document {
    customer: ICustomer["id"];
    message: string;
}

// Instance methods
export interface IInquiryMethods {
    getCustomerInfo(): Promise<{
        firstname: ICustomer["firstname"];
        lastname: ICustomer["lastname"];
        email: ICustomer["email"];
        phone?: ICustomer["phone"];
    }>;
}

// Statics
export interface IInquiryModel extends Model<IInquiry, IInquiryMethods> {
    findByEmail(email: string): Promise<IInquiry | null>;
    filter(filter: Record<string, string>, sort: string, direction: "ASC" | "DESC"): Promise<IInquiry[]>;
}

// Utility Types
export type SafeInquiry = {
    id: string;
    customer: SafeCustomer;
    message: string;
};

export function sanitizeInquiry(inquiry: IInquiry): SafeInquiry {
    return {
        id: inquiry.id,
        customer: sanitizeCustomer(inquiry.customer as ICustomer),
        message: inquiry.message
    };
}

export const CreateInquiryDTO = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    message: z.string().max(500)
});


export type CreateInquiryInput = z.infer<typeof CreateInquiryDTO>;
