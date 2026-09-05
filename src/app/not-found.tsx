'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { JSX } from 'react';

export const dynamic = 'force-dynamic';

export default function NotFound(): JSX.Element {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleReturn = () => {
    window.location.href = '/';
  };

  return (
    <main 
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-black text-gray-200 font-mono"
      role="alert"
      aria-labelledby="not-found-title"
    >
      <div className="max-w-md w-full border border-red-900/60 bg-neutral-950 p-6 rounded-lg shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <h1 id="not-found-title" className="text-xl font-bold text-red-500 tracking-wide">
            [404] ROUTE NOT FOUND
          </h1>
        </div>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          The requested system node or route does not exist within the Dalek Caan architecture.
        </p>
        <p className="text-[11px] text-amber-400/80 mb-6 font-mono">
          Auto-redirecting to Command Console in {countdown}s...
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleReturn}
            className="w-full sm:w-auto px-5 py-2 text-xs font-semibold bg-red-950 hover:bg-red-900 border border-red-700 text-red-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-sm"
          >
            Return to Command Console
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-gray-300 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500"
          >
            Direct Link (/)
          </Link>
        </div>
      </div>
    </main>
  );
}