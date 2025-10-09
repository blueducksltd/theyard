// types/Space.ts
import { Model } from "mongoose";
import { Document } from "mongoose";
// import { Model } from "mongoose";
import { z } from "zod";

// -----------------------------
// TypeScript interface
// -----------------------------
export interface ISpace extends Document {
  name: string;
  imageUrl: string;
  pricePerHour: number;
  specs: string[];
  address: string;
  capacity: number;
  description?: string;
  createdAt?: Date;
}

// Instance methods
export interface ISpaceMethods {
  formatAddress(): string;
}

// Statics
export interface ISpaceModel extends Model<ISpace, ISpaceMethods> {
  findByName(name: string): Promise<ISpace | null>;
  filterByCapacity(minCapacity: number): Promise<ISpace[]>;
}

// Other utility types
export type SafeSpace = {
  id: string;
  name: string;
  pricePerHour: number;
  imageUrl: string;
  specs: string[];
  address: string;
  capacity: number;
  description?: string;
  createdAt?: Date
};

export function sanitizeSpace(space: ISpace): SafeSpace {
  return {
    id: space.id,
    name: space.name,
    pricePerHour: space.pricePerHour,
    imageUrl: space.imageUrl,
    specs: space.specs,
    address: space.address,
    capacity: space.capacity,
    description: space.description,
    createdAt: space.createdAt,
  };
}

// ---------------------------
//      Zod Schemas (DTOs)    //
// ---------------------------
export const CreateSpaceDto = z.object({
  name: z.string().min(3).max(100),
  pricePerHour: z.number().min(0),
  specs: z.array(z.string().min(1)).min(1),
  address: z.string().min(5).max(200),
  capacity: z.number().min(1),
  description: z.string().min(10).max(1000),
  imageUrl: z.string().url().optional(),
});

export type CreateSpaceInput = z.infer<typeof CreateSpaceDto>;
