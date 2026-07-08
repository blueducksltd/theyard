import { Document, Model } from "mongoose";
import z from "zod";

// Document fields
export interface IEvent extends Document {
  title: string;
  description: string;
  slug: string;
  public: boolean;
  date: Date;
  images: string[];
  time: {
    start: string; // "14:00"
    end: string; // "18:00"
  };
  audienceType: "children" | "adults" | "both";
  activities: string[];
  adultPrice?: number;
  childPrice?: number;
  status: "active" | "completed" | "cancelled" | "pending";
  location: string;
}

export interface IEventClient {
  id: string;
  title: string;
  description: string;
  slug: string;
  public: boolean;
  date: Date;
  images: string[];
  endTime: string;
  startTime: string;
 
  audienceType: "children" | "adults" | "both";
  activities: string[];
  adultPrice?: number;
  childPrice?: number;
  status: "active" | "completed" | "cancelled" | "pending";
  location: string;
  includes: []
}

// Instance methods
export interface IEventMethods {
  [key: string]: never;
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
  audienceType: IEvent["audienceType"];
  activities: string[];
  adultPrice?: number;
  childPrice?: number;
  location: string;
  status: IEvent["status"];
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
    startTime: event.time?.start || "09:00",
    endTime: event.time?.end || "18:00",
    audienceType: event.audienceType,
    activities: event.activities || [],
    adultPrice: event.adultPrice,
    childPrice: event.childPrice,
    location: event.location,
    status: event.status,
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
  activities: z.array(z.string().min(1, "Activity cannot be empty")).optional(),
});

export const CreateEventAdminDTO = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
    audienceType: z.enum(["children", "adults", "both"]),
    adultPrice: z.number().optional(),
    childPrice: z.number().optional(),
    public: z.boolean().optional().default(false),
    location: z.string().optional(),
    customerId: z.string().optional(),
    activities: z.array(z.string().min(1, "Activity cannot be empty")).optional(),
  })
  .superRefine((data, ctx) => {
    if ((data.audienceType === "adults" || data.audienceType === "both") && (data.adultPrice === undefined || data.adultPrice < 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Adult price is required for adults/both events",
        path: ["adultPrice"],
      });
    }

    if ((data.audienceType === "children" || data.audienceType === "both") && (data.childPrice === undefined || data.childPrice < 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Child price is required for children/both events",
        path: ["childPrice"],
      });
    }
  });

export type CreateEventInput = z.infer<typeof CreateEventDTO>;
export type CreateEventAdminInput = z.infer<typeof CreateEventAdminDTO>;

export const SignUpEventDTO = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  adultsComing: z.number().int().min(0).optional(),
  childrenComing: z.number().int().min(0).optional(),
});

export type SignUpEventInput = z.infer<typeof SignUpEventDTO>;
