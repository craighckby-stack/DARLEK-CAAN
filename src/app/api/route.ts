import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Standard structure for API responses.
 */
interface ApiResponse {
  readonly success: boolean;
  readonly message: string;
  readonly timestamp: string;
}

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_INTERNAL_ERROR = 500;
const DEFAULT_ERROR_MESSAGE = "Internal Server Error";
const GREETING_MESSAGE = "Hello, world!";

const RESPONSE_HEADERS = Object.freeze({
  "Cache-Control": "no-store, max-age=0",
  "Content-Type": "application/json; charset=utf-8",
});

const SUCCESS_INIT = Object.freeze({
  status: HTTP_STATUS_OK,
  headers: RESPONSE_HEADERS,
});

const ERROR_INIT = Object.freeze({
  status: HTTP_STATUS_INTERNAL_ERROR,
  headers: RESPONSE_HEADERS,
});

/**
 * Generates a standardized API response object with a current ISO timestamp.
 */
function createApiResponse(success: boolean, message: string): ApiResponse {
  return {
    success,
    message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Extracts a safe error message from an unknown caught exception.
 */
function resolveErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;
}

/**
 * Handles GET requests to the health/root API endpoint.
 */
export async function GET(_request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const payload = createApiResponse(true, GREETING_MESSAGE);
    return NextResponse.json(payload, SUCCESS_INIT);
  } catch (error: unknown) {
    const payload = createApiResponse(false, resolveErrorMessage(error));
    return NextResponse.json(payload, ERROR_INIT);
  }
}