import { safeFetchJson } from './safe-json';

export interface ApiResult<T> {
  readonly success: boolean;
  readonly data: T | null;
  readonly status: number;
  readonly error?: string;
}

/**
 * Validates that the provided URL is a non-empty string.
 */
function isValidUrl(url: unknown): url is string {
  return typeof url === 'string' && url.length > 0;
}

/**
 * Normalizes an unknown caught error into a readable error message.
 */
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected network error occurred.';
}

/**
 * Safely performs an HTTP fetch request and normalizes the JSON response.
 */
export async function safeApiFetch<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<ApiResult<T>> {
  if (!isValidUrl(url)) {
    return {
      success: false,
      data: null,
      status: 400,
      error: 'Invalid or missing URL provided to safeApiFetch.',
    };
  }

  try {
    const result = await safeFetchJson<T>(url, options);
    
    return {
      success: Boolean(result?.success),
      data: result?.data ?? null,
      status: typeof result?.status === 'number' ? result.status : 500,
      ...(result?.error ? { error: result.error } : {}),
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      status: 500,
      error: getErrorMessage(error),
    };
  }
}