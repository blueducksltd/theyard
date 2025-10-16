import { Schema, models, model, Types } from "mongoose";
import {
  IBooking,
  IBookingMethods,
  IBookingModel
} from "../types/Booking";
import { generateSlots } from "@/lib/util";
import { startOfDay, endOfDay } from "date-fns";

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
    times: [{
      type: String, required: true
    }],
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

BookingSchema.pre("save", function (next) {
  if (this.startTime && this.endTime) {
    this.times = generateSlots(this.startTime, this.endTime);
  }
  next();
});


BookingSchema.statics.isDoubleBooked = async function (
  spaceId: string,
  date: Date,
  startTime: string,
  endTime: string
): Promise<boolean> {
  const requestedSlots = generateSlots(startTime, endTime);

  const bookings = await this.find({ space: spaceId, eventDate: date });
  if (bookings.length === 0) return false;

  // Check overlap
  return bookings.some((b: IBooking) =>
    b.times.some((t: string) => requestedSlots.includes(t))
  );
};


BookingSchema.statics.findByDateRange = async function (start: Date, end?: Date): Promise<IBooking[]> {
  if (!end) {
    const dayStart = startOfDay(start);
    const dayEnd = endOfDay(start);

    return this.find({
      eventDate: { $gte: dayStart, $lte: dayEnd },
    });
  }

  return this.find({
    eventDate: { $gte: start, $lte: end },
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