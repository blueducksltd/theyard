import { Schema, models, model } from "mongoose";
import {
    IService,
    IServiceMethods,
    IServiceModel
} from "../types/Service";

// Schema definition with TS generics
const ServiceSchema = new Schema<IService, IServiceModel, IServiceMethods>(
    {
        name: { type: String, required: true },
        description: { type: String },
        imageUrl: { type: String }
    },
    { timestamps: true }
);

// Export model
const Service =
    (models.Service as IServiceModel) ||
    model<IService, IServiceModel>("Service", ServiceSchema);


export default Service;