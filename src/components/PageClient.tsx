'use client';

import { useState, useEffect, type JSX } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface LoadingScreenProps {
  readonly message: string;
}

/**
 * Terminal-styled loading indicator maintaining visual continuity
 * during client-side hydration and dynamic bundle resolution.
 */
function LoadingScreen({ message }: LoadingScreenProps): JSX.Element {
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

/**
 * Client-side boundary wrapper handling hydration lifecycle states
 * and rendering the core application safely within an ErrorBoundary.
 */
export default function PageClient(): JSX.Element {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const content = isMounted ? (
    <MainPage />
  ) : (
    <LoadingScreen message="[DARLEK CAAN] INITIALIZING COGNITIVE DOMINANCE ENGINE..." />
  );

  return <ErrorBoundary>{content}</ErrorBoundary>;
}