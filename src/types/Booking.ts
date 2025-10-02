// types/Booking.ts
import { Document } from "mongoose";
import { Model } from "mongoose";
import { z } from "zod";
import { ICustomer, SafeCustomer, sanitizeCustomer } from "./Customer";
import { ISpace, SafeSpace, sanitizeSpace } from "./Space";
import { IEvent, SafeEvent, sanitizeEvent } from "./Event";
import { IPackage, SafePackage, sanitizePackage } from "./Package";

// -----------------------------
// TypeScript interface
// -----------------------------
export interface IBooking extends Document, IBookingMethods {
    customer: ICustomer["id"];
    space: ISpace["id"];
    event: IEvent["id"];
    package: IPackage["id"];
    eventDate: Date;
    startTime: string;
    endTime: string;
    times: string[];
    status: "pending" | "confirmed" | "cancelled";
    totalPrice: number;
}

// Instance methods
export interface IBookingMethods {
    eventDetails(): Promise<IEvent | null>;
    spaceDetails(): Promise<ISpace | null>;
    customerDetails(): Promise<ICustomer | null>;
}

// Statics
export interface IBookingModel extends Model<IBooking, IBookingMethods> {
    isDoubleBooked(
        spaceId: string,
        eventDate: Date,
        startTime: string,
        endTime: string,
    ): Promise<boolean>;
    filter(filter: Record<string, string>, sort: string, direction: "ASC" | "DESC", admin?: boolean): Promise<IBooking[]>;
    findByCustomer(customerId: ICustomer["id"]): Promise<IBooking[]>;
    findBySpace(spaceId: ISpace["id"]): Promise<IBooking[]>;
    findByDateRange(start: Date, end?: Date): Promise<IBooking[]>;
}

// Other utility types
export type SafeBooking = {
    id: string;
    eventDate: Date;
    startTime: string;
    endTime: string;
    status: string;
    totalPrice: number;
    customer: SafeCustomer | null;
    space: SafeSpace | null;
    event: SafeEvent | null;
    package: SafePackage | null;
};


export function sanitizeBooking(booking: IBooking): SafeBooking {
    return {
        id: booking.id,
        eventDate: booking.eventDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        totalPrice: booking.totalPrice,
        customer: booking.customer ? sanitizeCustomer(booking.customer) : null,
        space: booking.space ? sanitizeSpace(booking.space) : null,
        event: booking.event ? sanitizeEvent(booking.event) : null,
        package: booking.package ? sanitizePackage(booking.package) : null,
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
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, use YYYY-MM-DD"),
    startTime: z
        .string({
            error: "field `startTime` is required",
        })
        .regex(
            /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
            "field `startTime` must be in HH:MM 24-hour format",
        ),
    endTime: z
        .string({
            error: "field `endTime` is required",
        })
        .regex(
            /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
            "field `endTime` must be in HH:MM 24-hour format",
        ),
    spaceId: z.string({
        error: "field `spaceId` is required",
    }),
    packageId: z.string({
        error: "field `packageId` is required",
    }),
    eventTitle: z.string({
        error: "field `eventTitle` is required",
    }),
    eventType: z.enum(
        ["picnics", "birthdays", "weddings", "corporate", "seasonal"],
        {
            error:
                "field `eventType` is required and must be one of Picnics, Birthdays, Weddings, Corporate, Seasonal",
        },
    ),
    eventDescription: z.string().optional(),
    public: z.boolean().optional().default(false),
});

export type CreateBookingInput = z.infer<typeof CreateBookingDto>;
