import { useState, useEffect, useRef, useCallback } from 'react';
import type { SystemState } from '@/lib/types';

export interface UseSystemOrchestratorReturn {
  readonly isReady: boolean;
  readonly latency: number;
}

const HANDSHAKE_DELAY_MS = 150 as const;

export const useSystemOrchestrator = (state: SystemState): UseSystemOrchestratorReturn => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [latency, setLatency] = useState<number>(0);
  
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const executeHandshake = useCallback((): (() => void) => {
    const startTime = performance.now();
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    try {
      timeoutId = setTimeout(() => {
        if (!isMountedRef.current) return;
        
        const computedLatency = performance.now() - startTime;
        setLatency(computedLatency);
        setIsReady(true);
      }, HANDSHAKE_DELAY_MS);
    } catch (error) {
      if (isMountedRef.current) {
        setIsReady(false);
        setLatency(0);
      }
      console.error('Darlek Caan: Handshake execution failure', error);
    }

    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    const cleanupHandshake = executeHandshake();
    return cleanupHandshake;
  }, [state.evolutionCycle, executeHandshake]);

  return { isReady, latency } as const;
};