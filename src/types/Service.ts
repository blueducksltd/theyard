import { Model } from "mongoose";
import { Document } from "mongoose";
import z from "zod";

// Document fields
export interface IService extends Document {
    name: string;
    description: string;
    imageUrl: string;
}

// Instance methods
export interface IServiceMethods {
    formatPrice(): string;
}

// Statics
export interface IServiceModel extends Model<IService, IServiceMethods> {
    findByName(name: string): Promise<IService | null>;
}

export type SafeService = {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
};

export function sanitizeService(services: IService): SafeService {
    return {
        id: services.id,
        name: services.name,
        description: services.description,
        imageUrl: services.imageUrl,
    };
}

export const CreateServiceDTO = z.object({
    name: z.string(),
    description: z.string().optional(),
    imageUrl: z.string().url().optional()
});

export const UpdateServiceDTO = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    imageUrl: z.string().url().optional()
});


export type CreateServiceInput = z.infer<typeof CreateServiceDTO>;
export type UpdateServiceInput = z.infer<typeof UpdateServiceDTO>;
