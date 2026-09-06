'use client';

import { useEffect } from 'react';

const SUPPRESSED_PATTERNS = [
  'hmr-client',
  'Failed to load chunk',
  'turbopack',
  'error.js',
  'global-error.js',
];

const SUPPRESSED_NAMES = new Set(['ChunkLoadError']);

/**
 * Evaluates whether an unhandled promise rejection reason matches suppression criteria.
 * Optimized with direct loop unrolling/traversal to eliminate allocation overhead.
 */
function shouldSuppressError(reason: unknown): boolean {
  if (reason === null || reason === undefined) {
    return false;
  }

  let message: string | undefined;
  let name: string | undefined;

  if (typeof reason === 'string') {
    message = reason;
  } else if (typeof reason === 'object') {
    const err = reason as Record<string, unknown>;
    if (typeof err.message === 'string') {
      message = err.message;
    }
    if (typeof err.name === 'string') {
      name = err.name;
    }
  }

  if (name !== undefined && SUPPRESSED_NAMES.has(name)) {
    return true;
  }

  if (message !== undefined) {
    const patterns = SUPPRESSED_PATTERNS;
    const len = patterns.length;
    for (let i = 0; i < len; i++) {
      if (message.includes(patterns[i]!)) {
        return true;
      }
    }
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