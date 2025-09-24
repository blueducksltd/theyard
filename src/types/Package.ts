import { Document } from "mongoose";
import z from "zod";

// Document fields
export interface IPackage extends Document {
  name: string;
  price: number;
  specs: string[];
  description: string;
  imageUrl: string;
}

// Instance methods
// export interface IPackageMethods {
// }

// Statics
// export interface IPackageModel extends Model<IPackage, {}, IPackageMethods> {
// }

export type SafePackage = {
  id: string;
  name: string;
  price: number;
  specs: string[];
  description: string;
  imageUrl: string;
};

export function sanitizePackage(packages: IPackage): SafePackage {
  return {
    id: packages.id,
    name: packages.name,
    price: packages.price,
    specs: packages.specs,
    description: packages.description,
    imageUrl: packages.imageUrl,
  };
}

export const CreatePackageDTO = z.object({
  name: z.string(),
  price: z.number(),
  specs: z.array(z.string()),
});

export type CreatePackageInput = z.infer<typeof CreatePackageDTO>;
