// lib/errors/withErrorHandler.ts
import { NextRequest } from "next/server";
import APIError from "./APIError";
import APIResponse from "../APIResponse";

// Generic error handler with typed context
export function errorHandler<C>(
  handler: (req: NextRequest, context: C) => Promise<Response>
) {
  return async (req: NextRequest, context: C) => {
    try {
      return await handler(req, context);
    } catch (err) {
      const error = APIError.from(err);
      return APIResponse.error(error.message, error.statusCode, error.toJSON());
    }
  };
}
