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
});

const STATIC_SUCCESS_RESPONSE: ApiResponse = Object.freeze({
  success: true,
  message: "Hello, world!",
  timestamp: new Date(0).toISOString(), // Pre-allocated or dynamically updated
});

const STATIC_SUCCESS_PAYLOAD_STRING = JSON.stringify(STATIC_SUCCESS_RESPONSE);

const SUCCESS_INIT = Object.freeze({
  status: 200,
  headers: RESPONSE_HEADERS,
});

const ERROR_INIT = Object.freeze({
  status: 500,
  headers: RESPONSE_HEADERS,
});

export async function GET(_request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // Utilize direct string serialization or pre-allocated objects to minimize heap allocation overhead
    const payload: ApiResponse = {
      success: true,
      message: "Hello, world!",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(payload, SUCCESS_INIT);
  } catch (error: unknown) {
    const payload: ApiResponse = {
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(payload, ERROR_INIT);
  }
}