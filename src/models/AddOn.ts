import { Schema, models, model } from "mongoose";
import { IAddOn, IAddOnModel, IAddOnMethods } from "../types/AddOn";

const AddOnSchema = new Schema<IAddOn, IAddOnModel, IAddOnMethods>(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["decoration", "food", "game"],
    },
    description: { type: String },
    price: { type: Number },
    pricePerMin: { type: Number },
    imageUrl: { type: String },
  },
  { timestamps: true },
);

const AddOn = (models.AddOn as IAddOnModel) || model<IAddOn, IAddOnModel>("AddOn", AddOnSchema);

export default AddOn;
