import { Schema, models, model, Types } from "mongoose";
import {
  IGallery,
  IGalleryMethods,
  IGalleryModel
} from "../types/Gallery";
import Event from "./Event";

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
    }
  },
  { timestamps: true }
);

GallerySchema.post("save", async function (doc) {
  // 'doc' is the saved Gallery document
  if (doc.event) {
    // Add this gallery to the event's gallery array if not already present
    await Event.findByIdAndUpdate(
      doc.event,
      { $addToSet: { gallery: doc._id } }, // assumes Event has a 'gallery' array
      { new: true }
    );
  }
});


// Export model
const Gallery =
  (models.Gallery as IGalleryModel) ||
  model<IGallery, IGalleryModel>("Gallery", GallerySchema);


export default Gallery;