/**
 * @file useSystemBootstrap.ts
 * @module Hooks
 * @description EMG Core v49 optimized hook for tracking system bootstrap lifecycle events.
 * Implements strict memory safety, zero-overhead event binding, and explicit type contracts.
 */

import { useEffect, useState, startTransition, useCallback, useRef } from 'react';

/**
 * Custom event name defining the system bootstrap ready state trigger.
 */
const SYSTEM_READY_EVENT = 'system-ready' as const;

/**
 * Static event listener options optimized for passive event execution.
 */
const LISTENER_OPTIONS: AddEventListenerOptions = { passive: true } as const;

/**
 * Interface representing the return contract for useSystemBootstrap.
 */
export type UseSystemBootstrapReturn = boolean;

/**
 * Subscribes to the window system readiness lifecycle event with guaranteed reference stability and memoization safety.
 */
const useSystemReadinessSubscription = (onReady: () => void): void => {
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const handleEvent = (): void => {
      try {
        onReadyRef.current();
      } catch (error: unknown) {
        console.error('[EMG Core v49] Error executing system readiness handler:', error);
      }
    };

    try {
      window.addEventListener(SYSTEM_READY_EVENT, handleEvent, LISTENER_OPTIONS);
    } catch (error: unknown) {
      console.error('[EMG Core v49] Failed to attach system readiness listener:', error);
    }
    
    return () => {
      try {
        window.removeEventListener(SYSTEM_READY_EVENT, handleEvent, LISTENER_OPTIONS);
      } catch (error: unknown) {
        console.error('[EMG Core v49] Failed to remove system readiness listener:', error);
      }
    };
  }, []);
};

/**
 * Optimally manages and observes the system bootstrap readiness state via window events with concurrent transitions.
 * 
 * @returns {UseSystemBootstrapReturn} Boolean flag indicating system readiness.
 */
export const useSystemBootstrap = (): UseSystemBootstrapReturn => {
  const [isSystemReady, setIsSystemReady] = useState<boolean>(false);

  const handleSystemReady = useCallback((): void => {
    startTransition(() => {
      setIsSystemReady(true);
    });
  }, []);

  useSystemReadinessSubscription(handleSystemReady);

  return isSystemReady;
};