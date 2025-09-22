import { Document, Model } from "mongoose";
import z from "zod";
import { ICustomer } from "./Customer";
import { IEvent } from "./Event";

// Document fields
export interface IGallery extends Document {
    title: string;
    description: string;
    images: string[];
    event: IEvent["id"];
    category: IEvent["type"];
    customer: ICustomer["id"]
}

// Instance methods
export interface IGalleryMethods {
}

// Statics
export interface IGalleryModel extends Model<IGallery, {}, IGalleryMethods> {
    filter(filter: IEvent["type"]) : Promise<IGallery | null>
}

export const CreateGalleryDTO = z.object({
    name: z.string(),
    price: z.number(),
    specs: z.array(z.string())
})

export type CreateGalleryInput = z.infer<typeof CreateGalleryDTO>;