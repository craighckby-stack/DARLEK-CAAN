/**
 * @file useSystemBootstrap.ts
 * @module EMG/Core/Hooks
 * @description Sovereign-tier optimized hook for tracking system bootstrap lifecycle events.
 * Implements strict memory safety, zero-overhead event binding, and explicit type contracts.
 */

import { useEffect, useState, startTransition } from 'react';

/**
 * Custom event name defining the system bootstrap ready state trigger.
 */
const SYSTEM_READY_EVENT = 'system-ready' as const;

/**
 * Static event listener options optimized for passive event execution.
 */
const LISTENER_OPTIONS = { passive: true } as const;

/**
 * Interface representing the return contract for useSystemBootstrap.
 */
export type UseSystemBootstrapReturn = boolean;

/**
 * Optimally manages and observes the system bootstrap readiness state via window events.
 * 
 * @returns {UseSystemBootstrapReturn} Boolean flag indicating system readiness.
 */
export const useSystemBootstrap = (): UseSystemBootstrapReturn => {
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const handleReady = (): void => {
      startTransition(() => {
        setIsReady(true);
      });
    };

    window.addEventListener(SYSTEM_READY_EVENT, handleReady, LISTENER_OPTIONS);
    
    return () => {
      window.removeEventListener(SYSTEM_READY_EVENT, handleReady, LISTENER_OPTIONS);
    };
  }, []);

  return isReady;
};