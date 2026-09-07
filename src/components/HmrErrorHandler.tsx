'use client';

import { useEffect, type JSX } from 'react';

const SUPPRESSED_MESSAGE_PATTERNS = [
  'hmr-client',
  'Failed to load chunk',
  'turbopack',
  'error.js',
  'global-error.js',
] as const;

const SUPPRESSED_ERROR_NAMES = new Set(['ChunkLoadError']);

interface ErrorObjectLike {
  readonly message?: unknown;
  readonly name?: unknown;
}

interface ErrorInfo {
  readonly message?: string;
  readonly name?: string;
}

/**
 * Extracts error details from an unknown rejection reason with strict type narrowing.
 */
function extractErrorInfo(reason: unknown): ErrorInfo {
  if (typeof reason === 'string') {
    return { message: reason };
  }

  if (reason !== null && typeof reason === 'object') {
    const errorObj = reason as ErrorObjectLike;
    return {
      message: typeof errorObj.message === 'string' ? errorObj.message : undefined,
      name: typeof errorObj.name === 'string' ? errorObj.name : undefined,
    };
  }

  return {};
}

/**
 * Evaluates whether an unhandled promise rejection reason matches suppression criteria.
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
    for (let i = 0; i < SUPPRESSED_MESSAGE_PATTERNS.length; i++) {
      if (message.includes(SUPPRESSED_MESSAGE_PATTERNS[i])) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Client-side utility that safely intercepts and suppresses noisy HMR and chunk loading rejections.
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