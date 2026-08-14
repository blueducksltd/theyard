import { Schema, models, model } from "mongoose";
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
    time: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "18:00" }
    },
    audienceType: {
      type: String,
      enum: ["children", "adults", "both"],
      required: true,
      default: "both"
    },
    activities: [{ type: String }],
    adultPrice: { type: Number },
    childPrice: { type: Number },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled", "pending", "closed"],
      default: "pending"
    },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
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

// Reuse the model during hot reloads, but also update an already-cached
// schema created before the `closed` status was added. Without this, the
// development server can keep validating against the old enum.
const cachedEventModel = models.Event as IEventModel | undefined;
if (cachedEventModel) {
  const statusPath = cachedEventModel.schema.path("status") as { enumValues?: string[] } | undefined;
  if (statusPath?.enumValues && !statusPath.enumValues.includes("closed")) {
    statusPath.enumValues.push("closed");
  }
}

// Export model
const Event = cachedEventModel || model<IEvent, IEventModel>("Event", EventSchema);


export default Event;
