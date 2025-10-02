// lib/errors/withErrorHandler.ts
import { NextRequest } from "next/server";
import APIError from "./APIError";
import APIResponse from "../APIResponse";

export function errorHandler<
  C extends { params?: Record<string, unknown> }
>(
  handler: (
    req: NextRequest,
    context: { params: Promise<C["params"]> }
  ) => Promise<Response>
) {
  return async (
    req: NextRequest,
    context: { params: Promise<C["params"]> }
  ) => {
    try {
      return await handler(req, context);
    } catch (err) {
      const error = APIError.from(err);
      return APIResponse.error(error.message, error.statusCode, error.toJSON());
    }
  };
}
