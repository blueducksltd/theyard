import { Document, Model } from "mongoose";
import z from "zod";
import { IGallery } from "./Gallery";
import { ICustomer } from "./Customer";


// Document fields
export interface IEvent extends Document {
    title: string;
    description: string;
    customer: ICustomer["id"];
    gallery: IGallery["id"];
    type: "Picnics" | "Birthdays" | "Weddings" | "Corporate" | "Seasonal"
    public: boolean;
    date: Date;
    time: {
        start: string; // "14:00"
        end: string;   // "18:00"
    };
    status: "Active" | "Completed" | "Cancelled" | "Pending";
    location: string;
}

// Instance methods
export interface IEventMethods {
}

// Statics
export interface IEventModel extends Model<IEvent, {}, IEventMethods> {
}

// Other utility types
export type SafeEvent = {
    id: string;
    title: string;
    description: string;
    gallery: IGallery["id"];
    type: "Picnics" | "Birthdays" | "Weddings" | "Corporate" | "Seasonal"
    public: boolean;
    date: Date;
    startTime: string;
    endTime: string;
    location: string;
};

export function sanitizeEvent(event: IEvent): SafeEvent {
    return {
        id: event.id,
        title: event.title,
        description: event.description,
        gallery: event.gallery,
        type: event.type,
        public: event.public,
        date: event.date,
        startTime: event.time.start,
        endTime: event.time.end,
        location: event.location,
    };
}

export const CreateEventDTO = z.object({
    name: z.string(),
    price: z.number(),
    specs: z.array(z.string())
})

export type CreateEventInput = z.infer<typeof CreateEventDTO>;