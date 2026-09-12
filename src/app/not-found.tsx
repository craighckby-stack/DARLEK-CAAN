/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: src/app/not-found.tsx
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */


import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import Link from 'next/link';
import type { JSX } from 'react';

export const dynamic = 'force-dynamic';

const REDIRECT_DELAY_SECONDS = 3;
const ROOT_ROUTE = '/';

/**
 * Custom hook to handle automatic redirection countdown logic with clean interval lifecycle management.
 */
function useAutoRedirect(initialSeconds: number, targetUrl: string): number {
  const [countdown, setCountdown] = useState<number>(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          window.location.replace(targetUrl);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetUrl]);

  return countdown;
}

/**
 * Visual indicator representing a live system pulse, memoized to eliminate redundant renders.
 */
const SystemPulseIndicator = memo(function SystemPulseIndicator(): JSX.Element {
  return <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" aria-hidden="true" />;
});

/**
 * Action controls for manual route recovery, featuring stable callback allocations and accessible routing.
 */
const RecoveryActionPanel = memo(function RecoveryActionPanel(): JSX.Element {
  const handleImmediateReturn = useCallback((): void => {
    window.location.replace(ROOT_ROUTE);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      <button
        type="button"
        onClick={handleImmediateReturn}
        className="w-full sm:w-auto px-5 py-2 text-xs font-semibold bg-red-950 hover:bg-red-900 border border-red-700 text-red-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-sm"
      >
        Return to Command Console
      </button>
      <Link
        href={ROOT_ROUTE}
        className="w-full sm:w-auto px-4 py-2 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-gray-300 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 text-center"
      >
        Direct Link (/)
      </Link>
    </div>
  );
});

export default function NotFound(): JSX.Element {
  const countdown = useAutoRedirect(REDIRECT_DELAY_SECONDS, ROOT_ROUTE);

  const countdownText = useMemo(() => 
    `Auto-redirecting to Command Console in ${countdown}s...`,
    [countdown]
  );

  return (
    <main 
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-black text-gray-200 font-mono"
      role="alert"
      aria-labelledby="not-found-title"
    >
      <div className="max-w-md w-full border border-red-900/60 bg-neutral-950 p-6 rounded-lg shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-3">
          <SystemPulseIndicator />
          <h1 id="not-found-title" className="text-xl font-bold text-red-500 tracking-wide">
            [404] ROUTE NOT FOUND
          </h1>
        </div>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          The requested system node or route does not exist within the Dalek Caan architecture.
        </p>
        <p className="text-[11px] text-amber-400/80 mb-6 font-mono">
          {countdownText}
        </p>
        <RecoveryActionPanel />
      </div>
    </main>
  );
}