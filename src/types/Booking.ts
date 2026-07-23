// types/Booking.ts
import { Document, FilterQuery, Model } from "mongoose";
import { z } from "zod";
import { ICustomer, SafeCustomer, sanitizeCustomer } from "./Customer";
import { IEvent, SafeEvent, sanitizeEvent } from "./Event";
import { IPackage, SafePackage, sanitizePackage } from "./Package";
import { SafeSpace, sanitizeSpace } from "./Space";
import { ISpace } from "./Space";

// -----------------------------
// TypeScript interface
// -----------------------------
export interface IBooking extends Document, IBookingMethods {
  customer: ICustomer["id"];
  event?: IEvent["id"];
  package: IPackage["id"];
  space?: unknown;
  eventDate: Date;
  guestCount: number;
  time?: string;
  addon?: string[];
  status: "pending" | "confirmed" | "cancelled";
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

// Instance methods
export interface IBookingMethods {
  eventDetails(): Promise<IEvent | null>;
  customerDetails(): Promise<ICustomer | null>;
}

// Statics
export interface IBookingModel extends Model<IBooking, IBookingMethods> {
  filter(
    filter: FilterQuery<IBooking>,
    sort: string,
    direction: "ASC" | "DESC",
    admin?: boolean,
  ): Promise<IBooking[]>;
  findByCustomer(customerId: ICustomer["id"]): Promise<IBooking[]>;
  findByDateRange(start: Date, end?: Date): Promise<IBooking[]>;
}

// Other utility types
export type SafeBooking = {
  id: string;
  eventDate: Date;
  guestCount: number;
  time?: string;
  addon?: string[];
  status: string;
  totalPrice: number;
  customer: SafeCustomer | null;
  event: SafeEvent | null;
  package: SafePackage | null;
  space: SafeSpace | null;
  createdAt: Date;
  updatedAt: Date;
};

export function sanitizeBooking(booking: IBooking): SafeBooking {
  return {
    id: booking.id,
    eventDate: booking.eventDate,
    guestCount: booking.guestCount,
    time: booking.time,
    addon: booking.addon,
    status: booking.status,
    totalPrice: booking.totalPrice,
    customer: booking.customer ? sanitizeCustomer(booking.customer) : null,
    event: booking.event ? sanitizeEvent(booking.event) : null,
    package: booking.package ? sanitizePackage(booking.package) : null,
    space: booking.space ? sanitizeSpace(booking.space as unknown as ISpace) : null,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}

// ---------------------------
//      Zod Schemas (DTOs)    //
// ---------------------------
export const CreateBookingDto = z.object({
  firstName: z.string({
    error: "field `firstName` is required",
  }),
  lastName: z.string({
    error: "field `lastName` is required",
  }),
  email: z
    .string({
      error: "field `email` is required",
    })
    .email("field `email` must be a valid email"),
  phone: z
    .string({
      error: "field `phone` is required",
    })
    .min(10, "field `phone` must be at least 10 characters"),
  date: z
    .string()
    .refine(
      (val) => {
        // Accept multiple date formats
        const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
        const standardRegex = /^\d{4}-\d{2}-\d{2}$/;
        const usRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        const euRegex = /^\d{2}\.\d{2}\.\d{4}$/;

        return (
          isoRegex.test(val) ||
          standardRegex.test(val) ||
          usRegex.test(val) ||
          euRegex.test(val)
        );
      },
      "Invalid date format. Use YYYY-MM-DD, ISO 8601, MM/DD/YYYY, or DD.MM.YYYY",
    ),
  guestCount: z.coerce.number({
    error: "field `guestCount` is required",
  }).min(1),
  packageId: z.string({
    error: "field `packageId` is required",
  }),
  spaceId: z.string().optional(),
  time: z.string().optional(),
  addon: z.array(z.string()).optional(),
  eventDescription: z.string().optional(),
});

export const UpdateBookingDto = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("field `email` must be a valid email").optional(),
  phone: z
    .string()
    .min(10, "field `phone` must be at least 10 characters")
    .optional(),
  date: z
    .string()
    .refine(
      (val) => {
        // Accept multiple date formats
        const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
        const standardRegex = /^\d{4}-\d{2}-\d{2}$/;
        const usRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        const euRegex = /^\d{2}\.\d{2}\.\d{4}$/;

        return (
          isoRegex.test(val) ||
          standardRegex.test(val) ||
          usRegex.test(val) ||
          euRegex.test(val)
        );
      },
      "Invalid date format. Use YYYY-MM-DD, ISO 8601, MM/DD/YYYY, or DD.MM.YYYY",
    )
    .optional(),
  guestCount: z.coerce.number().optional(),
  packageId: z.string().optional(),
  spaceId: z.string().optional(),
  time: z.string().optional(),
  addon: z.array(z.string()).optional(),
  eventType: z
    .enum(["picnics", "birthdays", "weddings", "corporate", "seasonal"], {
      error:
        "field `eventType` is required and must be one of picnics, birthdays, weddings, corporate, seasonal",
    })
    .optional(),
  eventDescription: z.string().optional(),
  status: z
    .enum(["pending", "confirmed", "cancelled"], {
      error: "field `status` is required and must be one of pending,",
    })
    .optional(),
});

export type CreateBookingInput = z.infer<typeof CreateBookingDto>;
export type UpdateBookingInput = z.infer<typeof UpdateBookingDto>;
