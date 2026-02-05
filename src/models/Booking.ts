import { Schema, models, model, Types } from "mongoose";
import {
  IBooking,
  IBookingMethods,
  IBookingModel
} from "../types/Booking";
import { startOfDay, endOfDay } from "date-fns";

// Schema definition with TS generics
const BookingSchema = new Schema<IBooking, IBookingModel, IBookingMethods>(
  {
    customer: { type: Types.ObjectId, ref: "Customer", required: true },
    space: { type: Types.ObjectId, ref: "Space", required: true },
    event: { type: Types.ObjectId, ref: "Event", required: true },
    package: { type: Types.ObjectId, ref: "Package", required: true },
    eventDate: { type: Date, required: true },
    guestCount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);


BookingSchema.statics.isDoubleBooked = async function (
  spaceId: string,
  eventDate: Date
): Promise<boolean> {
  const dayStart = startOfDay(eventDate);
  const dayEnd = endOfDay(eventDate);

  const count = await this.countDocuments({
    space: spaceId,
    eventDate: { $gte: dayStart, $lte: dayEnd },
    status: { $ne: "cancelled" }
  });

  return count > 0;
};


BookingSchema.statics.findByDateRange = async function (start: Date, end?: Date): Promise<IBooking[]> {
  if (!end) {
    const dayStart = startOfDay(start);
    const dayEnd = endOfDay(start);

    return this.find({
      eventDate: { $gte: dayStart, $lte: dayEnd },
      status: { $ne: "cancelled" }
    });
  }

  return this.find({
    eventDate: { $gte: start, $lte: end },
    status: { $ne: "cancelled" }
  });
};

BookingSchema.statics.filter = async function (
  filter: Record<string, string>,
  sort: string,
  direction: "ASC" | "DESC"
) {
  const sortDirection = direction.toUpperCase() === "ASC" ? 1 : -1;
  return this.find(filter).sort({ [sort]: sortDirection })
    .populate("customer")
    .populate("space")
    .populate("event")
    .populate("package")
}


// Export model
const Booking =
  (models.Booking as IBookingModel) ||
  model<IBooking, IBookingModel>("Booking", BookingSchema);


export default Booking;