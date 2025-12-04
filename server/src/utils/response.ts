import { ApiResponse } from "../types/api";

export function successResponse(data: unknown, statusCode = 200): ApiResponse {
  return {
    statusCode,
    body: JSON.stringify({
      success: true,
      data,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
}

export function errorResponse(message: string, statusCode = 400): ApiResponse {
  return {
    statusCode,
    body: JSON.stringify({
      success: false,
      error: message,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
}
