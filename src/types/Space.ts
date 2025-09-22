// types/Space.ts
import { Document } from "mongoose";
import { Model } from "mongoose";
import { z } from "zod";

// -----------------------------
// TypeScript interface
// -----------------------------
export interface ISpace extends Document, ISpaceMethods {
    name: string;
    pricePerHour: number;
    specs: string[];
    address: string;
    capacity: number;
    description?: string;
}


// Instance methods
export interface ISpaceMethods {

}

// Statics
export interface ISpaceModel extends Model<ISpace, {}, ISpaceMethods> {

}

// Other utility types
export type SafeSpace = {
    id: string;
    name: string;
    pricePerHour: number;
    specs: string[];
    address: string;
    capacity: number;
    description?: string;
};

export function sanitizeSpace(space: ISpace): SafeSpace {
    return {
        id: space.id,
        name: space.name,
        pricePerHour: space.pricePerHour,
        specs: space.specs,
        address: space.address,
        capacity: space.capacity,
        description: space.description,
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
    description: z.string().min(10).max(1000).optional(),
});

export type CreateSpaceInput = z.infer<typeof CreateSpaceDto>;