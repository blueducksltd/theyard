// models/Admin.ts
import { Schema, models, model } from "mongoose";
import { IAdmin, IAdminMethods, IAdminModel } from "../types/Admin";
import bcrypt from "bcryptjs";

const AdminSchema = new Schema<IAdmin, IAdminModel, IAdminMethods>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "manager"], default: "manager" },
    permissions: [
      { type: Number }
    ],
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    phone: { type: String },
    imageUrl: { type: String },
    emailVerificationCode: { type: String },
    emailVerificationExpires: { type: Date },
    emailVerificationLastSent: { type: Date },
    emailVerifiedAt: { type: Date },
  },
  { timestamps: true }
);

// Hash password before save
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method
AdminSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

// Static method
AdminSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email });
};

// Export model
const Admin =
  (models.Admin as IAdminModel) ||
  model<IAdmin, IAdminModel>("Admin", AdminSchema);


export default Admin;