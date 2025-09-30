import { Document, Model } from "mongoose";
import z from "zod";
import { ICustomer } from "./Customer";
import { IEvent } from "./Event";

// Document fields
export interface IGallery extends Document {
  title: string;
  description: string;
  imageUrl: string;
  event: IEvent["id"] | null;
  category: IEvent["type"];
}

// Instance methods
export interface IGalleryMethods {
  getGalleryOwner(): Promise<ICustomer | null>;
}

// Statics
export interface IGalleryModel extends Model<IGallery> {
  filter(filter: Record<string, string>, sort: string, direction: "ASC" | "DESC", admin?: boolean): Promise<IGallery[]>;
}

export const CreateGalleryDTO = z.object({
  title: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().url(),
  eventId: z.string().optional(),
  category: z.enum(["picnics", "birthdays", "weddings", "corporate", "seasonal"])
});

export type CreateGalleryInput = z.infer<typeof CreateGalleryDTO>;
