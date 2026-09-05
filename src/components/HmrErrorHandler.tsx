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
 * Extracts normalized error message and name from an unknown rejection reason.
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
 * Determines whether an unhandled promise rejection should be suppressed.
 */
function shouldSuppressError(name?: string, message?: string): boolean {
  if (name && SUPPRESSED_ERROR_NAMES.has(name)) {
    return true;
  }

  if (message && SUPPRESSED_ERROR_PATTERNS.some((pattern) => message.includes(pattern))) {
    return true;
  }

  return false;
}

/**
 * Client-side utility that suppresses noisy HMR and chunk loading unhandled rejections.
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