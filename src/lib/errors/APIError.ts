// lib/errors/APIError.ts
import { ZodError } from "zod";
import mongoose from "mongoose";

export default class APIError extends Error {
  statusCode: number;
  details?: string | { [key: string]: string };

  constructor(
    statusCode: number,
    message: string,
    details?: string | { [key: string]: string },
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    // log directly to Sentry
    if (process.env.NODE_ENV === "production") {
      console.error(this);
    } else {
      console.error(this.stack);
    }
  }

  static BadRequest(message: string, details?: any) {
    return new APIError(400, message, details);
  }

  static Unauthorized(message = "Unauthorized") {
    return new APIError(401, message);
  }

  static Forbidden(message = "Forbidden") {
    return new APIError(403, message);
  }

  static NotFound(message = "Not Found") {
    return new APIError(404, message);
  }

  static Conflict(message = "Conflict") {
    return new APIError(409, message);
  }

  static Internal(message = "Internal Server Error") {
    return new APIError(500, message);
  }

  /**
   * Map raw errors (Zod, Mongoose, native) to APIError
   */
  static from(err: unknown): APIError {
    if (err instanceof APIError) {
      return err;
    }

    if (err instanceof ZodError) {
      const issue = err.issues[0];
      const field = issue.path.join(".");
      let expected = "";

      if (issue.code === "invalid_type") {
        expected = ` ${issue.expected}`;
      }

      const message = `${issue.code} ${field} is expecting${expected}`;

      return APIError.BadRequest(`Validation failed: ${message}`, err.issues);
    }

    if (err instanceof mongoose.Error.ValidationError) {
      return APIError.BadRequest(err.message, err.errors);
    }

    if (err instanceof mongoose.Error.CastError) {
      return APIError.BadRequest(`Invalid ${err.path}: ${err.value}`);
    }

    if ((err as any).code === 11000) {
      return APIError.Conflict("Duplicate key error");
    }

    if (err instanceof Error) {
      return APIError.Internal(err.message);
    }

    return APIError.Internal("Unknown error");
  }

  toJSON() {
    return {
      status: "error",
      statusCode: this.statusCode,
      message: this.message,
      ...(this.details && { details: this.details }),
    };
  }
}
