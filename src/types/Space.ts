// types/Space.ts
import { Model, Document } from "mongoose";
import { z } from "zod";

// -----------------------------
// TypeScript interface
// -----------------------------
export interface ISpace extends Document {
  name: string;
  guestLimit: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Instance methods
export interface ISpaceMethods {
  // placeholder for future methods
}

// Statics
export interface ISpaceModel extends Model<ISpace, object, ISpaceMethods> {
  findByName(name: string): Promise<ISpace | null>;
}

// Safe serialisable type (sent to the client)
export type SafeSpace = {
  id: string;
  name: string;
  guestLimit: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export function sanitizeSpace(space: ISpace): SafeSpace {
  return {
    id: space.id || (space as unknown as { _id: string })._id?.toString(),
    name: space.name,
    guestLimit: space.guestLimit ?? 50,
    createdAt: space.createdAt,
    updatedAt: space.updatedAt,
  };
}

// ---------------------------
//      Zod Schemas (DTOs)
// ---------------------------
export const CreateSpaceDto = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  guestLimit: z.coerce.number().min(1, "Guest limit must be at least 1"),
});

export const UpdateSpaceDTO = z.object({
  name: z.string().min(2).max(100).optional(),
  guestLimit: z.coerce.number().min(1).optional(),
});

export type CreateSpaceInput = z.infer<typeof CreateSpaceDto>;
export type UpdateSpaceInput = z.infer<typeof UpdateSpaceDTO>;