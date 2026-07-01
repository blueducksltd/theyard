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
    slug: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }],
    // type: {
    //   type: String,
    //   enum: ["picnics", "birthdays", "weddings", "corporate", "seasonal"],
    //   required: true
    // },
    public: { type: Boolean, default: false },
    date: { type: Date, required: true },
    // time: {
    //   start: { type: String, required: true },
    //   end: { type: String, required: true }
    // },
    audienceType: {
      type: String,
      enum: ["children", "adults", "both"],
      required: true,
      default: "both"
    },
    adultPrice: { type: Number },
    childPrice: { type: Number },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled", "pending"],
      default: "pending"
    },
    location: { type: String, required: true }
  },
  { timestamps: true }
);

EventSchema.virtual("signUps", {
  ref: "SignUp",
  localField: "_id",
  foreignField: "eventId",
});

EventSchema.statics.filter = async function (filter: Record<string, string>, sort: string, direction: "ASC" | "DESC") {

  return this.find(filter)
    .sort({ [sort]: direction === "ASC" ? 1 : -1 });
}

// Export model
const Event =
  (models.Event as IEventModel) ||
  model<IEvent, IEventModel>("Event", EventSchema);


export default Event;