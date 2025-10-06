// types/Admin.ts
import { Document } from "mongoose";
import { Model } from "mongoose";
import { z } from "zod";

// -----------------------------
// TypeScript interface
// -----------------------------
export interface IAdmin extends Document, IAdminMethods {
  name: string;
  email: string;
  password: string; // hashed
  role: "admin" | "manager";
  permissions: number[];
  status: "active" | "inactive";
  phone: string;
  imageUrl: string
}

type SafeAdmin = {
  id: string;
  name: string;
  email: string;
  role: IAdmin["role"];
  status: IAdmin["status"];
  phone: string;
  imageUrl: string;
};

// Instance methods
export interface IAdminMethods {
  comparePassword(password: string): Promise<boolean>;
}

// Statics
export interface IAdminModel extends Model<IAdmin, IAdminMethods> {
  findByEmail(email: string): Promise<IAdmin | null>;
}

// ---------------------------
//      Zod Schemas (DTOs)    //
// ---------------------------

// Create Admin
export const CreateAdminDto = z.object({
  name: z.string({
    error: "field `name` is required",
  }),
  email: z
    .string({
      error: "field `email` is required",
    })
    .email("field `email` must be a valid email"),
  password: z
    .string({
      error: "field `password` is required",
    })
    .min(6, "field `password` must be at least 6 characters"),
  role: z.enum(["admin", "manager"]).default("manager"),
});

// Update Admin (all optional, useful for PATCH)
export const UpdateAdminDto = z.object({
  name: z.string().optional(),
  email: z.string().email("field `email` must be valid").optional(),
  password: z
    .string()
    .min(6, "field `password` must be at least 6 chars")
    .optional(),
  role: z.enum(["admin", "manager"]).optional(),
  permissions: z.array(z.number()).optional(),
  phone: z.string().min(10),
  imageUrl: z.string().optional()
});

// Admin Login
export const LoginAdminDto = z.object({
  email: z
    .string({
      error: "field `email` is required",
    })
    .email("field `email` must be a valid email"),
  password: z.string({
    error: "field `password` is required",
  }),
});

export function sanitizeAdmin(admin: IAdmin): SafeAdmin {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    status: admin.status,
    phone: admin.phone,
    imageUrl: admin.imageUrl
  };
}

// -----------------------------
// Types inferred from DTOs
// -----------------------------
export type CreateAdminInput = z.infer<typeof CreateAdminDto>;
export type UpdateAdminInput = z.infer<typeof UpdateAdminDto>;
export type LoginAdminInput = z.infer<typeof LoginAdminDto>;
