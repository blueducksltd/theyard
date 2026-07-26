import { Schema, models, model } from "mongoose";
import { ISpace, ISpaceMethods, ISpaceModel } from "../types/Space";

const SpaceSchema = new Schema<ISpace, ISpaceModel, ISpaceMethods>(
  {
    name: { type: String, required: true },
    guestLimit: { type: Number, required: true, default: 50 },
  },
  { timestamps: true }
);

// Mongoose keeps registered models across Next.js hot reloads. Re-register the
// model in development so removed required fields do not remain in the schema.
if (process.env.NODE_ENV === "development" && models.Space) {
  delete models.Space;
}

const Space =
  (models.Space as ISpaceModel) ||
  model<ISpace, ISpaceModel>("Space", SpaceSchema);

export default Space;
