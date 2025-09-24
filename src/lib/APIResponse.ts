import { NextResponse } from "next/server";

export default class APIResponse {
  /**
   * Remove common sensitive fields from mongoose docs or plain objects
   */
  static sanitize<T extends Record<string, any>>(doc: T | null): Partial<T> | null {
    if (!doc) return null;

    const obj =
      typeof (doc as any).toObject === "function"
        ? (doc as any).toObject()
        : { ...doc };

    delete obj.password;
    delete obj.__v;

    return obj;
  }

  /**
   * Success response
   */
  static success<T>(
    message: string,
    data: T,
    status = 200
  ) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status }
    );
  }

  /**
   * Error response
   */
  static error(
    message: string,
    status = 400,
    errors: any = null
  ) {
    return NextResponse.json(
      {
        success: false,
        message,
        errors,
      },
      { status }
    );
  }
}
