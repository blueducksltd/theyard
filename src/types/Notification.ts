import { Model } from "mongoose";
import { Document } from "mongoose";
import { ICustomer } from "./Customer";
import z from "zod";
import { IAdmin } from "./Admin";

// Document fields
export interface INotification extends Document {
    type: "inquiry" | "booking" | "payment" | "review" | "admin" | "subscription";
    title: string;
    message: string;
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
    title: string;
    message: string;
    type: INotification["type"];
    meta?: Record<string, unknown>;
    read: boolean;
};

export function sanitizeNotification(Notification: INotification, admin: IAdmin["id"]): SafeNotification {
    const read = Notification.readBy.includes(admin);
    return {
        id: Notification.id,
        title: Notification.title,
        message: Notification.message,
        type: Notification.type,
        meta: Notification.meta,
        read
    };
}

export const CreateNotificationDto = z.object({
    title: z.string(),
    type: z.enum(
        ["inquiry", "booking", "payment", "review", "admin", "subscription"],
        {
            error: "field `type` is required and must be one of inquiry, booking, payment",
        },
    ),
    message: z.string(),
    meta: z.record(z.string(), z.unknown()).optional(),
    permission: z.number()
});

export type CreateNotificationInput = z.infer<typeof CreateNotificationDto>;