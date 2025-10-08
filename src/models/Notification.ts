import { Schema, models, model, Types } from "mongoose";
import {
    INotification,
    INotificationMethods,
    INotificationModel
} from "../types/Notification";
import { IAdmin } from "@/types/Admin";

// Schema definition with TS generics
const NotificationSchema = new Schema<INotification, INotificationModel, INotificationMethods>(
    {
        type: { type: String, enum: ["inquiry", "booking", "payment", "review", "admin", "subscription"], required: true },
        message: { type: String, required: true },
        permission: { type: Number, required: true },
        meta: { type: Schema.Types.Mixed },
        readBy: [{ type: Types.ObjectId, ref: "Admin" }],
    },
    { timestamps: true }
);

NotificationSchema.statics.filter = async function (
    filter: Record<string, string>,
    sort: string,
    direction: "ASC" | "DESC",
    admin?: boolean
) {
    const sortDirection = direction.toUpperCase() === "ASC" ? 1 : -1;

    return admin
        ? this.find(filter).sort({ [sort]: sortDirection })
        : this.find({ status: "published" }).sort({ [sort]: sortDirection });
};

NotificationSchema.methods.markAsRead = async function (adminId: IAdmin["id"]) {
    this.readBy.push(adminId);
    await this.save();

    return this;
}

// Export model
const Notification =
    (models.Notification as INotificationModel) ||
    model<INotification, INotificationModel>("Notification", NotificationSchema);


export default Notification;