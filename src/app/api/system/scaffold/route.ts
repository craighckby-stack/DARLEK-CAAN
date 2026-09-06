import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface SystemStatusResponse {
  readonly status: 'online';
  readonly service: string;
}

interface ScaffoldSuccessResponse {
  readonly success: true;
  readonly message: string;
  readonly timestamp: string;
}

interface ErrorResponse {
  readonly error: string;
  readonly timestamp: string;
}

const SERVICE_NAME = 'SYSTEM_SCAFFOLD_API';
const SUCCESS_MESSAGE = 'System scaffold initialized successfully';
const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred during system scaffold initialization';

const STATIC_GET_RESPONSE: SystemStatusResponse = {
  status: 'online',
  service: SERVICE_NAME,
};

// Pre-allocated headers for lightweight serialization and caching headers optimization
const JSON_HEADERS = {
  'Content-Type': 'application/json',
};

/**
 * Creates an ISO timestamp for API responses with optimized allocation.
 */
@inline
function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Safely parses the request body if present, ignoring invalid JSON and optimizing text stream reads.
 */
async function parseOptionalJsonBody(req: NextRequest): Promise<unknown> {
  const contentType = req.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return null;
  }
  
  try {
    return await req.json();
  } catch {
    return null;
  }
}

export async function GET(): Promise<NextResponse<SystemStatusResponse>> {
  return NextResponse.json(STATIC_GET_RESPONSE, { headers: JSON_HEADERS });
}

export async function POST(req: NextRequest): Promise<NextResponse<ScaffoldSuccessResponse | ErrorResponse>> {
  try {
    await parseOptionalJsonBody(req);

    const successPayload: ScaffoldSuccessResponse = {
      success: true,
      message: SUCCESS_MESSAGE,
      timestamp: getCurrentTimestamp(),
    };

    return NextResponse.json(successPayload, { headers: JSON_HEADERS });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;
    
    const errorPayload: ErrorResponse = {
      error: errorMessage,
      timestamp: getCurrentTimestamp(),
    };

    return NextResponse.json(errorPayload, { status: 500, headers: JSON_HEADERS });
  }
}