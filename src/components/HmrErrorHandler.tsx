'use client';

import { useEffect } from 'react';

const SUPPRESSED_MESSAGE_PATTERNS = [
  'hmr-client',
  'Failed to load chunk',
  'turbopack',
  'error.js',
  'global-error.js',
] as const;

const SUPPRESSED_ERROR_NAMES = new Set(['ChunkLoadError']);

interface ErrorObjectLike {
  message?: unknown;
  name?: unknown;
}

/**
 * Extracts error details from an unknown rejection reason.
 */
function extractErrorInfo(reason: unknown): { message?: string; name?: string } {
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

  if (name && SUPPRESSED_ERROR_NAMES.has(name)) {
    return true;
  }

  if (message) {
    return SUPPRESSED_MESSAGE_PATTERNS.some((pattern) => message.includes(pattern));
  }

  return false;
}

/**
 * Client-side utility that safely intercepts and suppresses noisy HMR and chunk loading rejections.
 */
export default function HmrErrorHandler(): null {
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