import { NextResponse } from "next/server";

export interface ApiResponse<T = any> {
  status_code: number;
  status: "success" | "error";
  message: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export class ApiResponseBuilder {
  static success<T>(
    data: T,
    message: string = "Request successful",
    statusCode: number = 200
  ): NextResponse {
    const response: ApiResponse<T> = {
      status_code: statusCode,
      status: "success",
      message,
      data,
    };

    return NextResponse.json(response, { status: statusCode });
  }

  static error(
    message: string,
    statusCode: number = 500,
    errorCode: string = "INTERNAL_ERROR",
    details?: any
  ): NextResponse {
    const response: ApiResponse = {
      status_code: statusCode,
      status: "error",
      message,
      error: {
        code: errorCode,
        message,
        details,
      },
    };

    return NextResponse.json(response, { status: statusCode });
  }

  static unauthorized(message: string = "Unauthorized"): NextResponse {
    return this.error(message, 401, "UNAUTHORIZED");
  }

  static notFound(message: string = "Resource not found"): NextResponse {
    return this.error(message, 404, "NOT_FOUND");
  }

  static badRequest(
    message: string = "Bad request",
    details?: any
  ): NextResponse {
    return this.error(message, 400, "BAD_REQUEST", details);
  }

  static forbidden(message: string = "Forbidden"): NextResponse {
    return this.error(message, 403, "FORBIDDEN");
  }

  static tokenExpired(message: string = "Token expired"): NextResponse {
    return this.error(message, 401, "TOKEN_EXPIRED");
  }

  static spotifyError(
    message: string = "Spotify API error",
    details?: any
  ): NextResponse {
    return this.error(message, 502, "SPOTIFY_API_ERROR", details);
  }
}
