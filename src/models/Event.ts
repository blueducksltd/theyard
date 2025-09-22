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
    gallery: { type: Types.ObjectId, ref: "Gallery" },
    type: {
      type: String,
      enum: ["Picnics", "Birthdays", "Weddings", "Corporate", "Seasonal"],
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
      enum: ["Active", "Completed", "Cancelled", "Pending"],
      default: "Pending"
    },
    location: { type: String, required: true }
  },
  { timestamps: true }
);

// Export model
const Event =
  (models.Event as IEventModel) ||
  model<IEvent, IEventModel>("Event", EventSchema);


export default Event;