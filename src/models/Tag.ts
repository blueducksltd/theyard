import { Schema, models, model } from "mongoose";
import {
    ITag,
    ITagMethods,
    ITagModel
} from "../types/Tag";

// Schema definition with TS generics
const TagSchema = new Schema<ITag, ITagModel, ITagMethods>(
    {
        name: { type: String, required: true }
    },
    { timestamps: true }
);

TagSchema.statics.filter = async function (
    filter: Record<string, string>,
    sort: string,
    direction: "ASC" | "DESC"
) {
    const sortDirection = direction.toUpperCase() === "ASC" ? 1 : -1;

    return this.find(filter).sort({ [sort]: sortDirection });
};


// Export model
const Tag =
    (models.Tag as ITagModel) ||
    model<ITag, ITagModel>("Tag", TagSchema);


export default Tag;