// lib/auth.ts
import jwt, { JwtPayload } from "jsonwebtoken";
import { IAdmin } from "../types/Admin";
import { NextRequest } from "next/server";
import APIError from "./errors/APIError";
import Admin from "../models/Admin";

const JWT_SECRET = process.env.JWT_SECRET!;

// Payload type
export interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: IAdmin["role"];
}

// Generate JWT
export const generateToken = (admin: IAdmin) => {
  return jwt.sign(
    { id: admin.id.toString(), email: admin.email, role: admin.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Verify JWT
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};

// Require Auth
export const requireAuth = (req: NextRequest): TokenPayload => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw APIError.Unauthorized("Authorization header missing or malformed");
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) {
    throw APIError.Unauthorized("Invalid or expired token");
  }

  return payload;
};


// Require Role (RBAC check)
export const requireRole = async (payload: TokenPayload | null, ...roles: IAdmin["role"][]) => {
  if (!payload) return false;
  const admin = await Admin.findById(payload.id);
  if (!admin) {
    throw APIError.Unauthorized("Invalid Payload: Login again")
  }
  return roles.includes(admin.role);
};
