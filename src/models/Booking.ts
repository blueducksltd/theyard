import { Schema, models, model, Types } from "mongoose";
import {
  IBooking,
  IBookingMethods,
  IBookingModel
} from "../types/Booking";

// Schema definition with TS generics
const BookingSchema = new Schema<IBooking, IBookingModel, IBookingMethods>(
  {
    customer: { type: Types.ObjectId, ref: "Customer", required: true },
    space: { type: Types.ObjectId, ref: "Space", required: true },
    event: { type: Types.ObjectId, ref: "Event", required: true },
    package: { type: Types.ObjectId, ref: "Package", required: true },
    eventDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending" },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

// Static Methods
BookingSchema.statics.isDoubleBooked = async function (
  spaceId: string,
  eventDate: Date,
  startTime: string,
  endTime: string
): Promise<boolean> {
  const existing = await this.findOne({
    space: spaceId,
    eventDate,
    $or: [
      // booking starts inside requested window
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
    ],
  });
  return !!existing;
};


// Export model
const Booking =
  (models.Booking as IBookingModel) ||
  model<IBooking, IBookingModel>("Booking", BookingSchema);


export default Booking;