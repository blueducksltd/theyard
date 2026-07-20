import { Schema, model, models } from "mongoose";

const ClosedDaySchema = new Schema(
  {
    date: { type: Date, required: true, unique: true, index: true },
    reason: { type: String, default: "" },
    closedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true },
);

const ClosedDay = models.ClosedDay || model("ClosedDay", ClosedDaySchema);

export default ClosedDay;
