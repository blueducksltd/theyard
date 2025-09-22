import { Document, Model } from "mongoose";

// Document fields
export interface ICustomer extends Document {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
}

// Instance methods
export interface ICustomerMethods {
  getContactInfo(): Promise<{ email: ICustomer["email"], phone: ICustomer["phone"] }>;
}

// Statics
export interface ICustomerModel extends Model<ICustomer, {}, ICustomerMethods> {
  findByEmail(email: string): Promise<ICustomer | null>;
}

// Other utility types
export type SafeCustomer = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
}

export function sanitizeCustomer(customer: ICustomer): SafeCustomer {
  return {
    id: customer.id,
    firstname: customer.firstname,
    lastname: customer.lastname,
    email: customer.email,
    phone: customer.phone,
  };
}
