/**
 * @file useSystemBootstrap.ts
 * @module Hooks
 * @description Darlek Caan optimized hook for tracking system bootstrap lifecycle events.
 * Implements strict memory safety, zero-overhead event binding, and explicit type contracts.
 */

import { useEffect, useState, startTransition, useCallback } from 'react';

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
 * Subscribes to the window system readiness lifecycle event with guaranteed reference stability.
 */
const useSystemReadinessSubscription = (onReady: () => void): void => {
  useEffect(() => {
    try {
      window.addEventListener(SYSTEM_READY_EVENT, onReady, LISTENER_OPTIONS);
    } catch (error: unknown) {
      console.error('[EMG Core] Failed to attach system readiness listener:', error);
    }
    
    return () => {
      try {
        window.removeEventListener(SYSTEM_READY_EVENT, onReady, LISTENER_OPTIONS);
      } catch (error: unknown) {
        console.error('[EMG Core] Failed to remove system readiness listener:', error);
      }
    };
  }, [onReady]);
};

/**
 * Optimally manages and observes the system bootstrap readiness state via window events.
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