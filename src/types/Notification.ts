import { Model } from "mongoose";
import { Document } from "mongoose";
import { ICustomer, SafeCustomer, sanitizeCustomer } from "./Customer";
import z from "zod";
import { IAdmin } from "./Admin";

// Document fields
export interface INotification extends Document {
    type: "inquiry" | "booking" | "payment" | "review" | "admin";
    title: string;
    message: string;
    customer: ICustomer["id"];
    permission: number;
    meta?: Record<string, unknown>;
    readBy: IAdmin[];
}

// Instance methods
export interface INotificationMethods {
    getCustomerInfo(): Promise<{
        firstname: ICustomer["firstname"];
        lastname: ICustomer["lastname"];
        email: ICustomer["email"];
        phone?: ICustomer["phone"];
    }>;
    markAsRead(adminId: IAdmin["id"]): Promise<INotification>;
}

// Statics
export interface INotificationModel extends Model<INotification, INotificationMethods> {
    filter(filter: Record<string, string>, sort: string, direction: "ASC" | "DESC"): Promise<INotification[]>;
    markAllAsRead(): Promise<{ acknowledged: boolean; modifiedCount: number; }>;
}

// Utility Types
export type SafeNotification = {
    id: string;
    customer: SafeCustomer;
    message: string;
    type: INotification["type"];
    meta?: Record<string, unknown>;
};

export function sanitizeNotification(Notification: INotification): SafeNotification {
    return {
        id: Notification.id,
        customer: sanitizeCustomer(Notification.customer as ICustomer),
        message: Notification.message,
        type: Notification.type,
        meta: Notification.meta
    };
}

export const CreateNotificationDto = z.object({
    type: z.enum(
        ["inquiry", "booking", "payment"],
        {
            error: "field `type` is required and must be one of inquiry, booking, payment",
        },
    ),
    customer: z.string(),
    message: z.string(),
    meta: z.record(z.string(), z.unknown()).optional(),
    permission: z.number()
});

export type CreateNotificationInput = z.infer<typeof CreateNotificationDto>;