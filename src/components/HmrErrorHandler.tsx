/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: src/components/HmrErrorHandler.tsx
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

import { useEffect, type JSX } from 'react';

/**
 * Immutable collection of string tokens matching noisy HMR and chunk loading failures.
 */
const SUPPRESSED_MESSAGE_PATTERNS = [
  'hmr-client',
  'Failed to load chunk',
  'turbopack',
  'error.js',
  'global-error.js',
] as const;

/**
 * Set of exception class names designated for silent interception.
 */
const SUPPRESSED_ERROR_NAMES: ReadonlySet<string> = new Set(['ChunkLoadError']);

/**
 * Candidate structure representing generic error objects safely.
 */
interface ErrorObjectLike {
  readonly message?: unknown;
  readonly name?: unknown;
}

/**
 * Normalized representation of error attributes.
 */
interface ErrorInfo {
  readonly message?: string;
  readonly name?: string;
}

/**
 * Safely extracts textual attributes from an unknown rejection source.
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
 * Evaluates whether an unhandled promise rejection matches defined suppression criteria.
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
    return SUPPRESSED_MESSAGE_PATTERNS.some((pattern) => message.includes(pattern));
  }

  return false;
}

/**
 * Intercepts and manages unhandled promise rejections originating from HMR or chunk loader events.
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