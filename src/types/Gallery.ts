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
  mediaDate: Date;
  category: IEvent["type"];
}

// Instance methods
export interface IGalleryMethods {
  getGalleryOwner(): Promise<ICustomer | null>;
}

// Statics
export interface IGalleryModel extends Model<IGallery, IGalleryMethods> {
  filter(filter: Record<string, string>, sort: string, direction: "ASC" | "DESC"): Promise<IGallery[]>;
}

// utility types
export type SafeGallery = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: IEvent["type"];
  mediaDate: Date;
}

export function sanitizeGallery(gallery: IGallery) {
  return {
    id: gallery.id,
    title: gallery.title,
    description: gallery.description,
    imageUrl: gallery.imageUrl,
    category: gallery.category,
    mediaDate: gallery.mediaDate,
  }
}

export const CreateGalleryDTO = z.object({
  title: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().url(),
  eventId: z.string().optional(),
  category: z.enum(["picnics", "birthdays", "weddings", "corporate", "seasonal"]),
  mediaDate: z.date(),
});

export const UpdateGalleryDTO = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  eventId: z.string().optional(),
  category: z.enum(["picnics", "birthdays", "weddings", "corporate", "seasonal"]).optional()
});

export type CreateGalleryInput = z.infer<typeof CreateGalleryDTO>;
export type UpdateGalleryInput = z.infer<typeof UpdateGalleryDTO>;
