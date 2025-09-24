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
    images: [{ type: String }],
    event: {
      type: Types.ObjectId,
      ref: "Event"
    },
    category: {
      type: String
    },
    customer: {
      type: Types.ObjectId,
      ref: "Customer"
    }
  },
  { timestamps: true }
);

GallerySchema.statics.filter = async function (filter: string) {
  return this.find({category: filter});
};


// Export model
const Gallery =
  (models.Gallery as IGalleryModel) ||
  model<IGallery, IGalleryModel>("Gallery", GallerySchema);


export default Gallery;