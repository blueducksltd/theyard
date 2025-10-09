import { Document, Model } from "mongoose";
import z from "zod";
import { IGallery } from "./Gallery";

// Document fields
export interface ITag extends Document {
    name: string;
}

// Instance methods
export interface ITagMethods {
    getGalleryWithTag(): Promise<IGallery | null>;
}

// Statics
export interface ITagModel extends Model<ITag, ITagMethods> {
    filter(filter: Record<string, string>, sort: string, direction: "ASC" | "DESC", admin?: boolean): Promise<ITag[]>;
}

// Utility Types
export type SafeTag = {
    id: string;
    name: string;
}

export const sanitizeTag = (Tag: ITag): SafeTag => {
    return {
        id: Tag.id,
        name: Tag.name
    }
}

export const CreateTagDTO = z.object({
    name: z.string()
});

export const UpdateTagDTO = z.object({
    name: z.string().optional()
});

export type CreateTagInput = z.infer<typeof CreateTagDTO>;
export type UpdateTagInput = z.infer<typeof UpdateTagDTO>;