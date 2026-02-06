import { Document } from "mongoose";
import z from "zod";
import { ICustomer, SafeCustomer, sanitizeCustomer } from "./Customer";
import { Model } from "mongoose";

// Document fields
export interface IEvent extends Document {
  title: string;
  description: string;
  customer: ICustomer["id"];
  slug: string;
  public: boolean;
  date: Date;
  images: string[];
  time: {
    start: string; // "14:00"
    end: string; // "18:00"
  };
  status: "active" | "completed" | "cancelled" | "pending";
  location: string;
}

// Instance methods
export interface IEventMethods {
  getEventOwner(): Promise<ICustomer | null>;
}

// Statics
export interface IEventModel extends Model<IEvent, IEventMethods> {
  filter(
    filter: Record<string, string>,
    sort: string,
    direction: "ASC" | "DESC",
    admin?: boolean,
  ): Promise<IEvent[]>;
}

// Other utility types
export type SafeEvent = {
  id: string;
  title: string;
  description: string;
  images: string[];
  slug: string;
  public: boolean;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  customer?: SafeCustomer | null;
};

export function sanitizeEvent(event: IEvent): SafeEvent {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    images: event.images,
    slug: event.slug,
    public: event.public,
    date: event.date,
    startTime: event.time.start,
    endTime: event.time.end,
    location: event.location,
    customer: event.customer ? sanitizeCustomer(event.customer) : null,
  };
}

export const CreateEventDTO = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
  public: z.boolean().optional().default(false),
  images: z.array(z.string()).optional(),
  imageUrls: z.array(z.string()).optional(),
});

export type CreateEventInput = z.infer<typeof CreateEventDTO>;
