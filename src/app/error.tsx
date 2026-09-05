'use client';

import { useEffect, type FC, type MouseEventHandler } from 'react';

/**
 * Extended error interface containing an optional runtime digest.
 */
interface ApplicationError extends Error {
  digest?: string;
}

/**
 * Properties contract for the Global Error boundary component.
 */
interface ErrorBoundaryProps {
  error: ApplicationError;
  reset: () => void;
}

const FALLBACK_ERROR_MESSAGE = 'An unexpected error occurred.';

/**
 * Global Error Boundary for Next.js App Router.
 * Catches runtime exceptions and presents an isolated recovery terminal UI.
 */
export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps): JSX.Element {
  useEffect(() => {
    // Log fatal errors to internal monitoring infrastructures if needed
    console.error('Captured Runtime Exception:', error);
  }, [error]);

  const handleResetClick: MouseEventHandler<HTMLButtonElement> = () => {
    reset();
  };

  const errorMessage = error?.message || FALLBACK_ERROR_MESSAGE;

  return (
    <main 
      role="alert"
      className="flex min-h-[50vh] flex-col items-center justify-center bg-black p-6 font-mono text-white"
    >
      <div className="max-w-md rounded border border-red-900 bg-neutral-950 p-6 shadow-2xl">
        <h2 className="mb-2 font-bold text-red-500">SYSTEM ERROR</h2>
        <p className="mb-4 text-xs text-gray-400">{errorMessage}</p>
        <button
          type="button"
          onClick={handleResetClick}
          className="rounded border border-red-700 bg-red-950 px-3 py-1 text-xs text-red-200 transition-colors hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          Reset View
        </button>
      </div>
    </main>
  );
}