import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

interface ApiResponse {
  readonly success: boolean;
  readonly message: string;
  readonly timestamp: string;
}

const RESPONSE_HEADERS = Object.freeze({
  "Cache-Control": "no-store, max-age=0",
  "Content-Type": "application/json; charset=utf-8",
} as const);

/**
 * Generates a standardized API response payload.
 */
function createApiResponse(success: boolean, message: string): ApiResponse {
  return {
    success,
    message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Handles incoming GET requests for the API route with standardized error handling.
 */
export async function GET(_request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const payload = createApiResponse(true, "Hello, world!");
    
    return NextResponse.json(payload, {
      status: 200,
      headers: RESPONSE_HEADERS,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    const payload = createApiResponse(false, errorMessage);

    return NextResponse.json(payload, {
      status: 500,
      headers: RESPONSE_HEADERS,
    });
  }
}