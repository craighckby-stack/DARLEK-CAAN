'use client';

import { useEffect } from 'react';

const SUPPRESSED_ERROR_PATTERNS = [
  'hmr-client',
  'Failed to load chunk',
  'turbopack',
  'error.js',
  'global-error.js',
] as const;

const SUPPRESSED_ERROR_NAMES = new Set(['ChunkLoadError']);

interface ErrorDetails {
  readonly message?: string;
  readonly name?: string;
}

/**
 * Extracts a normalized message and name from an unknown rejection reason.
 */
function parseErrorReason(reason: unknown): ErrorDetails {
  if (typeof reason === 'string') {
    return { message: reason };
  }

  if (reason !== null && typeof reason === 'object') {
    const errorRecord = reason as Record<string, unknown>;
    return {
      message: typeof errorRecord.message === 'string' ? errorRecord.message : undefined,
      name: typeof errorRecord.name === 'string' ? errorRecord.name : undefined,
    };
  }

  return {};
}

/**
 * Evaluates whether an unhandled promise rejection matches suppression criteria.
 */
function shouldSuppressError(name?: string, message?: string): boolean {
  const isSuppressedByName = Boolean(name && SUPPRESSED_ERROR_NAMES.has(name));
  const isSuppressedByPattern = Boolean(
    message && SUPPRESSED_ERROR_PATTERNS.some((pattern) => message.includes(pattern))
  );

  return isSuppressedByName || isSuppressedByPattern;
}

/**
 * Client-side utility that safely intercepts and suppresses noisy HMR and chunk loading rejections.
 */
export default function HmrErrorHandler(): null {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
      const { message, name } = parseErrorReason(event.reason);

      if (shouldSuppressError(name, message)) {
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