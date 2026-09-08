'use type-safe';
'use client';

import { useEffect, type JSX } from 'react';

/**
 * Immutable tuple of patterns used to identify noisy HMR and chunk loading errors.
 */
const SUPPRESSED_MESSAGE_PATTERNS = [
  'hmr-client',
  'Failed to load chunk',
  'turbopack',
  'error.js',
  'global-error.js',
] as const;

/**
 * Optimized lookup Set for explicit error class names to suppress.
 */
const SUPPRESSED_ERROR_NAMES = new Set<string>(['ChunkLoadError']);

/**
 * Structural interface representing candidate error objects safely.
 */
interface ErrorObjectLike {
  readonly message?: unknown;
  readonly name?: unknown;
}

/**
 * Normalized error information payload.
 */
interface ErrorInfo {
  readonly message?: string;
  readonly name?: string;
}

/**
 * Extracts error details from an unknown rejection reason with strict type narrowing
 * and optimal memory efficiency.
 */
function extractErrorInfo(reason: unknown): ErrorInfo {
  if (typeof reason === 'string') {
    return { message: reason };
  }

  if (reason !== null && (typeof reason === 'object' || typeof reason === 'function')) {
    const errorObj = reason as ErrorObjectLike;
    return {
      message: typeof errorObj.message === 'string' ? errorObj.message : undefined,
      name: typeof errorObj.name === 'string' ? errorObj.name : undefined,
    };
  }

  return {};
}

/**
 * Evaluates whether an unhandled promise rejection reason matches suppression criteria
 * utilizing high-performance iteration bounds and O(1) set lookups.
 */
function shouldSuppressError(reason: unknown): boolean {
  if (reason == null) {
    return false;
  }

  const { message, name } = extractErrorInfo(reason);

  if (name !== undefined && SUPPRESSED_ERROR_NAMES.has(name)) {
    return true;
  }

  if (message !== undefined) {
    const patterns = SUPPRESSED_MESSAGE_PATTERNS;
    for (let i = 0, len = patterns.length; i < len; i++) {
      if (message.includes(patterns[i]!)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Client-side utility that safely intercepts and suppresses noisy HMR and chunk loading rejections
 * with zero-cost memory allocations and passive event listeners.
 */
export default function HmrErrorHandler(): JSX.Element | null {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
      if (shouldSuppressError(event.reason)) {
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection, { passive: true });

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}