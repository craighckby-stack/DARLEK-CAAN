'use client';

import { useEffect, useCallback, type JSX, type MouseEvent } from 'react';

interface ApplicationError extends Error {
  readonly digest?: string;
}

interface ErrorBoundaryProps {
  readonly error: ApplicationError;
  readonly reset: () => void;
}

const FALLBACK_ERROR_MESSAGE = 'An unexpected error occurred.';

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps): JSX.Element {
  useEffect((): void => {
    console.error('Captured Runtime Exception:', error);
  }, [error]);

  const handleResetClick = useCallback((event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    reset();
  }, [reset]);

  const errorMessage = error.message || FALLBACK_ERROR_MESSAGE;

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