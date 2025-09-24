// lib/errors/withErrorHandler.ts
import { NextRequest, NextResponse } from "next/server";
import APIError from "./APIError";
import APIResponse from "../APIResponse";

export function errorHandler<
  T extends (req: NextRequest, context?: any) => Promise<Response>
>(handler: T) {
  return async (req: NextRequest, context?: any) => {
    try {
      return await handler(req, context);
    } catch (err) {
      const error = APIError.from(err);
      return APIResponse.error(error.message, error.statusCode, error.toJSON());
    }
  };
}
