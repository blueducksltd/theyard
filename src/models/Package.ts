import { Schema, models, model } from "mongoose";
import {
  IPackage,
  IPackageMethods,
  IPackageModel
} from "../types/Package";

// Schema definition with TS generics
const PackageSchema = new Schema<IPackage, IPackageModel, IPackageMethods>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    weekendPrice: {type: Number},
    guestLimit: { type: Number, required: true },
    extraGuestFee: { type: Number, required: true },
    specs: [{ type: String, required: true }],
    description: { type: String },
    imageUrl: { type: String }
  },
  { timestamps: true }
);

// Export model
const Package =
  (models.Package as IPackageModel) ||
  model<IPackage, IPackageModel>("Package", PackageSchema);


export default Package;