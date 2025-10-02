import { NextResponse } from "next/server";

export default class APIResponse {

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
