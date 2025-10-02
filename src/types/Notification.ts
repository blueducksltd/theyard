import { Model } from "mongoose";
import { Document } from "mongoose";
import z from "zod";
import { ICustomer, SafeCustomer, sanitizeCustomer } from "./Customer";

// Document fields
export interface INotification extends Document {
    type: "inquiry" | "booking" | "payment";
    customer: ICustomer["id"];
    message: string;
    meta?: Record<string, string>;
    read: boolean;
}

// Instance methods
export interface INotificationMethods {
    getCustomerInfo(): Promise<{
        firstname: ICustomer["firstname"];
        lastname: ICustomer["lastname"];
        email: ICustomer["email"];
        phone?: ICustomer["phone"];
    }>;
    markAsRead(): Promise<INotification>;
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
    read: boolean;
    type: INotification["type"];
    meta?: Record<string, string>;
};

export function sanitizeNotification(Notification: INotification): SafeNotification {
    return {
        id: Notification.id,
        customer: sanitizeCustomer(Notification.customer as ICustomer),
        message: Notification.message,
        read: Notification.read,
        type: Notification.type,
        meta: Notification.meta
    };
}
