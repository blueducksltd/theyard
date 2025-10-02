// lib/errors/withErrorHandler.ts
import { NextRequest } from "next/server";
import APIError from "./APIError";
import APIResponse from "../APIResponse";

export function errorHandler<
  T extends (req: NextRequest, context?: unknown) => Promise<Response>
>(handler: T) {
  return async (req: NextRequest, context?: unknown) => {
    try {
      return await handler(req, context);
    } catch (err) {
      const error = APIError.from(err);
      return APIResponse.error(error.message, error.statusCode, error.toJSON());
    }
  };
}
