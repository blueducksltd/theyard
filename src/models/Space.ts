import { Schema, models, model } from "mongoose";
import {
    ISpace,
    ISpaceMethods,
    ISpaceModel
} from "../types/Space";

// Schema definition with TS generics
const SpaceSchema = new Schema<ISpace, ISpaceModel, ISpaceMethods>(
    {
        name: { type: String, required: true },
        pricePerHour: { type: Number, required: true },
        imageUrl: { type: String },
        specs: [{ type: String, required: true }],
        address: { type: String, required: true },
        capacity: { type: Number, required: true },
        description: { type: String, required: false },
    },
    { timestamps: true }
);

// Export model
const Space =
    (models.Space as ISpaceModel) ||
    model<ISpace, ISpaceModel>("Space", SpaceSchema);


export default Space;