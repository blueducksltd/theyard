import { Schema, models, model, Types } from "mongoose";
import {
  IGallery,
  IGalleryMethods,
  IGalleryModel
} from "../types/Gallery";

// Schema definition with TS generics
const GallerySchema = new Schema<IGallery, IGalleryModel, IGalleryMethods>(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    event: {
      type: Types.ObjectId,
      ref: "Event",
      required: false
    },
    category: {
      type: String
    },
    mediaDate: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

GallerySchema.statics.filter = async function (
  filter: Record<string, string>,
  sort: string,
  direction: "ASC" | "DESC"
) {
  const sortDirection = direction.toUpperCase() === "ASC" ? 1 : -1;
  return this.find(filter).sort({ [sort]: sortDirection }).populate("event")
}


// Export model
const Gallery =
  (models.Gallery as IGalleryModel) ||
  model<IGallery, IGalleryModel>("Gallery", GallerySchema);


export default Gallery;