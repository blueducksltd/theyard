import { Document, Model } from "mongoose";
import z from "zod";

// Document fields
export interface ICustomer extends Document {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
}

// Instance methods
export interface ICustomerMethods {
  getContactInfo(): Promise<{
    email: ICustomer["email"];
    phone: ICustomer["phone"];
  }>;
}

// Statics
export interface ICustomerModel extends Model<ICustomer, ICustomerMethods> {
  findByEmail(email: string): Promise<ICustomer | null>;
  subscribe(email: string): Promise<ICustomer>;
}

// Other utility types
export type SafeCustomer = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
};

export function sanitizeCustomer(customer: ICustomer): SafeCustomer {
  return {
    id: customer.id,
    firstname: customer.firstname,
    lastname: customer.lastname,
    email: customer.email,
    phone: customer.phone,
  };
}

// DTOs
export const SubscribeDTO = z.object({
  email: z.string().email()
});

export const SendEmailDto = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Body is required"),
  customers: z.array(z.string()).optional()
});


export type SubscribeInput = z.infer<typeof SubscribeDTO>;
export type SendEmailInput = z.infer<typeof SendEmailDto>;