import { Schema, models, model } from "mongoose";
import {
  ICustomer,
  ICustomerMethods,
  ICustomerModel
} from "../types/Customer";

// Schema definition with TS generics
const CustomerSchema = new Schema<ICustomer, ICustomerModel, ICustomerMethods>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
  },
  { timestamps: true }
);

// Instance method
CustomerSchema.methods.getContactInfo = async function (): Promise<{ email: ICustomer["email"], phone: ICustomer["phone"] }> {
  return { email: this.email, phone: this.phone }
};

// Static method
CustomerSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email });
};

CustomerSchema.statics.subscribe = async function (email: string) {
  const existing = await this.findOne({ email });
  if (existing) return existing;
  const subscriber = await this.create({ email, firstname: "Subscribed", lastname: "Customer" });
  return subscriber;
}

// Export model
const Customer =
  (models.Customer as ICustomerModel) ||
  model<ICustomer, ICustomerModel>("Customer", CustomerSchema);


export default Customer;