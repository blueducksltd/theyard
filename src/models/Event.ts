import { Schema, models, model, Types } from "mongoose";
import {
  IEvent,
  IEventMethods,
  IEventModel
} from "../types/Event";

// Schema definition with TS generics
const EventSchema = new Schema<IEvent, IEventModel, IEventMethods>(
  {
    title: { type: String, required: true },
    description: { type: String },
    customer: { type: Types.ObjectId, ref: "Customer", required: true },
    gallery: [{ type: Types.ObjectId, ref: "Gallery" }],
    type: {
      type: String,
      enum: ["picnics", "birthdays", "weddings", "corporate", "seasonal"],
      required: true
    },
    public: { type: Boolean, default: false },
    date: { type: Date, required: true },
    time: {
      start: { type: String, required: true },
      end: { type: String, required: true }
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled", "pending"],
      default: "pending"
    },
    location: { type: String, required: true }
  },
  { timestamps: true }
);

EventSchema.statics.filter = async function (filter: {}, sort: string, direction: "ASC" | "DESC", admin?: boolean) {
  let events;
  if (admin) {
    events = this.find(filter)
      .sort({ [sort]: direction === "ASC" ? 1 : -1 })
      .populate("customer", "id firstname lastname email phone")
      .populate("gallery", "imageUrl");
  }
  else {
    events = this.find({ ...filter, status: { $ne: "cancelled" }, public: true })
      .sort({ [sort]: direction === "ASC" ? 1 : -1 })
      .populate("customer", "id firstname lastname email phone")
      .populate("gallery", "imageUrl");
  }
  return events;
}

// Export model
const Event =
  (models.Event as IEventModel) ||
  model<IEvent, IEventModel>("Event", EventSchema);


export default Event;