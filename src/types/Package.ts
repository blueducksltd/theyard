import { Model } from "mongoose";
import { Document } from "mongoose";
import z from "zod";

// Document fields
export interface IPackage extends Document {
  name: string;
  price: number;
  specs: string[];
  description: string;
  imageUrl: string;
  guestLimit: number;
  extraGuestFee: number;
}

// Instance methods
export interface IPackageMethods {
  formatPrice(): string;
}

// Statics
export interface IPackageModel extends Model<IPackage, IPackageMethods> {
  findByName(name: string): Promise<IPackage | null>;
}

export type SafePackage = {
  id: string;
  name: string;
  price: number;
  specs: string[];
  description: string;
  imageUrl: string;
  guestLimit: Number;
  extraGuestFee: Number;
};

export function sanitizePackage(packages: IPackage): SafePackage {
  return {
    id: packages.id,
    name: packages.name,
    price: packages.price,
    specs: packages.specs,
    description: packages.description,
    imageUrl: packages.imageUrl,
    guestLimit: packages.guestLimit,
    extraGuestFee: packages.extraGuestFee
  };
}

export const CreatePackageDTO = z.object({
  name: z.string(),
  price: z.coerce.number(), // accepts "1000" and coerces to 1000
  guestLimit: z.coerce.number(),
  extraGuestFee: z.coerce.number(),
  specs: z.preprocess((val) => {
    if (Array.isArray(val)) {
      // already array (e.g., specs[]=a&specs[]=b)
      return val;
    }
    if (typeof val === "string") {
      // comma-separated string from form-data
      return val.split(",").map((s) => s.trim());
    }
    return [];
  }, z.array(z.string())),
  description: z.string(),
  imageUrl: z.string().url().optional()
});

export const UpdatePackageDTO = z.object({
  name: z.string().optional(),
  price: z.coerce.number().optional(), // accepts "1000" and coerces to 1000
  guestLimit: z.coerce.number().optional(),
  extraGuestFee: z.coerce.number().optional(),
  specs: z.preprocess((val) => {
    if (Array.isArray(val)) {
      // already array (e.g., specs[]=a&specs[]=b)
      return val;
    }
    if (typeof val === "string") {
      // comma-separated string from form-data
      return val.split(",").map((s) => s.trim());
    }
    return [];
  }, z.array(z.string())).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional()
});

export type CreatePackageInput = z.infer<typeof CreatePackageDTO>;
export type UpdatePackageInput = z.infer<typeof UpdatePackageDTO>;