import { Document, Model } from "mongoose";
import z from "zod";

export type AddOnCategory = "decoration" | "food" | "game";

export interface IAddOn extends Document {
  name: string;
  category: AddOnCategory;
  description?: string;
  price?: number;
  pricePerMin?: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddOnModelClient {
  id: string;
  name: string;
  category: AddOnCategory;
  description?: string;
  price?: number;
  pricePerMin?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type IAddOnMethods = Record<string, never>;

export type IAddOnModel = Model<IAddOn, IAddOnMethods>;

export type SafeAddOn = {
  id: string;
  name: string;
  category: AddOnCategory;
  description?: string;
  price?: number;
  pricePerMin?: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

export function sanitizeAddOn(addOn: IAddOn): SafeAddOn {
  return {
    id: addOn.id,
    name: addOn.name,
    category: addOn.category,
    description: addOn.description,
    price: addOn.price,
    pricePerMin: addOn.pricePerMin,
    imageUrl: addOn.imageUrl,
    createdAt: addOn.createdAt,
    updatedAt: addOn.updatedAt,
  };
}

export const CreateAddOnDTO = z
  .object({
    name: z.string({ error: "field `name` is required" }).min(1),
    category: z.enum(["decoration", "food", "game"]),
    description: z.string().optional(),
    price: z.number().optional(),
    pricePerMin: z.number().optional(),
    imageUrl: z.string().url().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.category === "food" && typeof data.price !== "number") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "field `price` is required for food add-ons",
        path: ["price"],
      });
    }

    if (data.category === "game" && typeof data.pricePerMin !== "number") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "field `pricePerMin` is required for game add-ons",
        path: ["pricePerMin"],
      });
    }

    if (data.category === "decoration" && (data.price !== undefined || data.pricePerMin !== undefined)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "decoration add-ons should not include pricing fields",
        path: ["price"],
      });
    }
  });

export const UpdateAddOnDTO = z.object({
  name: z.string().optional(),
  category: z.enum(["decoration", "food", "game"]).optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  pricePerMin: z.number().optional(),
  imageUrl: z.string().url().optional(),
});

export type CreateAddOnInput = z.infer<typeof CreateAddOnDTO>;
export type UpdateAddOnInput = z.infer<typeof UpdateAddOnDTO>;
