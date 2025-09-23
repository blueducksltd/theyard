import { Schema, models, model, Types } from "mongoose";
import {
  IBooking,
  IBookingMethods,
  IBookingModel
} from "../types/Booking";
import { parse } from "date-fns";

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

BookingSchema.statics.isDoubleBooked = async function (
  spaceId: string,
  eventDate: Date,
  startTime: string,
  endTime: string
): Promise<boolean> {
  // Normalize requested booking times into Date objects
  const start = parse(startTime, "HH:mm", eventDate);
  const end = parse(endTime, "HH:mm", eventDate);

  // Fetch all bookings for the same space & date
  const bookings = await this.find({ space: spaceId, eventDate });

  // Check for overlap in JS (date-to-date comparison)
  return bookings.some((b: any) => {
    const existingStart = parse(b.startTime, "HH:mm", eventDate);
    const existingEnd = parse(b.endTime, "HH:mm", eventDate);

    // Overlap condition: requested start < existing end AND requested end > existing start
    return start < existingEnd && end > existingStart;
  });
};



// Export model
const Booking =
  (models.Booking as IBookingModel) ||
  model<IBooking, IBookingModel>("Booking", BookingSchema);


export default Booking;