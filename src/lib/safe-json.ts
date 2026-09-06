import type { NextRequest } from 'next/server';

export interface SafeFetchResult<T> {
  success: boolean;
  data: T | null;
  status: number;
  error?: string;
}

const WHITESPACE_REGEX = /^\s*$/;

export function safeParseJson<T = unknown>(str: string | null | undefined, fallback: T = {} as T): T {
  if (typeof str !== 'string') {
    return fallback;
  }
  
  const trimmed = str.trim();
  if (!trimmed || WHITESPACE_REGEX.test(trimmed)) {
    return fallback;
  }

  try {
    return JSON.parse(trimmed) as T;
  } catch {
    return fallback;
  }
}

export async function safeReqJson<T = unknown>(req: Request | NextRequest, fallback: T = {} as T): Promise<T> {
  try {
    const text = await req.text();
    if (!text) {
      return fallback;
    }
    
    const trimmed = text.trim();
    if (!trimmed) {
      return fallback;
    }

    return JSON.parse(trimmed) as T;
  } catch {
    return fallback;
  }
}

export async function safeResponseJson<T = unknown>(res: Response, fallback: T = {} as T): Promise<T> {
  try {
    const text = await res.text();
    if (!text) {
      return fallback;
    }
    
    const trimmed = text.trim();
    if (!trimmed) {
      return fallback;
    }

    try {
      return JSON.parse(trimmed) as T;
    } catch {
      if (fallback !== null && typeof fallback === 'object') {
        const errorSnippet = trimmed.length > 200 ? trimmed.slice(0, 200) : trimmed;
        return Object.assign({}, fallback, { 
          error: errorSnippet, 
          rawText: trimmed 
        }) as unknown as T;
      }
      return fallback;
    }
  } catch {
    return fallback;
  }
}

export async function safeFetchJson<T = unknown>(
  url: string, 
  options?: RequestInit
): Promise<SafeFetchResult<T>> {
  try {
    const res = await fetch(url, options);
    const text = await res.text();
    
    if (!text) {
      return {
        success: res.ok,
        data: null,
        status: res.status,
        error: res.ok ? undefined : `HTTP ${res.status} Empty Response`,
      };
    }

    const trimmed = text.trim();
    if (!trimmed) {
      return {
        success: res.ok,
        data: null,
        status: res.status,
        error: res.ok ? undefined : `HTTP ${res.status} Empty Response`,
      };
    }

    try {
      const json = JSON.parse(trimmed);
      const isSuccess = res.ok && (json?.success !== false && json?.error === undefined);
      
      return {
        success: isSuccess,
        data: json as T,
        status: res.status,
        error: json?.error || (res.ok ? undefined : `HTTP ${res.status}`),
      };
    } catch {
      return {
        success: false,
        data: null,
        status: res.status,
        error: `Server error (${res.status}): Non-JSON response received (possible route crash or payload limit).`,
      };
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Network request failed';
    return {
      success: false,
      data: null,
      status: 500,
      error: errorMessage,
    };
  }
}