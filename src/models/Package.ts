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
    capacity: { type: Number, required: true, default: 0 },
    packageSpace: {
      type: Schema.Types.ObjectId,
      ref: "Space",
      required: true,
    },
    extraGuestFee: { type: Number, required: true },
    specs: [{ type: String, required: true }],
    description: { type: String },
    imageUrl: { type: String }
  },
  { timestamps: true }
);

// Mongoose keeps registered models across Next.js hot reloads. Re-register the
// model in development so removed required fields do not remain in the schema.
if (process.env.NODE_ENV === "development" && models.Package) {
  delete models.Package;
}

const Package =
  (models.Package as IPackageModel) ||
  model<IPackage, IPackageModel>("Package", PackageSchema);


export default Package;
