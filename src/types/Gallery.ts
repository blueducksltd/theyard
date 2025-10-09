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
  event: Partial<IEvent> | null
}

export function sanitizeGallery(gallery: IGallery) {
  return {
    id: gallery.id,
    title: gallery.title,
    description: gallery.description,
    imageUrl: gallery.imageUrl,
    category: gallery.category,
    mediaDate: gallery.mediaDate,
    event: gallery.event ? {
      id: gallery.event.id,
      title: gallery.event.title,
      description: gallery.event.description,
      public: gallery.event.public,
      type: gallery.event.type,
      date: gallery.event.date,
      startTime: gallery.event.startTime,
      endTime: gallery.event.endTime,
      location: gallery.event.location,
    } : null
  }
}

export const CreateGalleryDTO = z.object({
  title: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().url(),
  eventId: z.string().optional(),
  category: z.string(),
  mediaDate: z.date(),
});

export const UpdateGalleryDTO = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  eventId: z.string().optional(),
  category: z.string().optional()
});

export type CreateGalleryInput = z.infer<typeof CreateGalleryDTO>;
export type UpdateGalleryInput = z.infer<typeof UpdateGalleryDTO>;
