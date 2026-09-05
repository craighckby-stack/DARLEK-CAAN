'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ErrorBoundary';

/**
 * Terminal-styled loading indicator maintaining visual continuity
 * during client-side hydration and dynamic bundle resolution.
 */
function LoadingScreen({ message }: { message: string }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center font-mono text-xs"
      style={{ background: '#030101', color: '#00ffcc' }}
    >
      <div className="flex items-center gap-2 animate-pulse">
        <span>{message}</span>
      </div>
    </div>
  );
}

const MainPage = dynamic(() => import('@/components/MainPage'), {
  ssr: false,
  loading: () => <LoadingScreen message="[DARLEK CAAN] SYNAPSE INJECTION IN PROGRESS..." />,
});

export default function PageClient() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <ErrorBoundary>
      {isMounted ? (
        <MainPage />
      ) : (
        <LoadingScreen message="[DARLEK CAAN] INITIALIZING COGNITIVE DOMINANCE ENGINE..." />
      )}
    </ErrorBoundary>
  );
}