import { Schema, models, model, Types } from "mongoose";
import {
    INotification,
    INotificationMethods,
    INotificationModel
} from "../types/Notification";

// Schema definition with TS generics
const NotificationSchema = new Schema<INotification, INotificationModel, INotificationMethods>(
    {
        type: { type: String, enum: ["inquiry", "booking", "payment"], required: true },
        customer: { type: Types.ObjectId, ref: "Customer", required: true },
        message: { type: String, required: true },
        permission: { type: Number, required: true },
        meta: { type: Schema.Types.Mixed },
        read: { type: Boolean, default: false },
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


// Export model
const Notification =
    (models.Notification as INotificationModel) ||
    model<INotification, INotificationModel>("Notification", NotificationSchema);


export default Notification;