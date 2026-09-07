/**
 * @file useSystemBootstrap.ts
 * @module Hooks
 * @description Darlek Caan optimized hook for tracking system bootstrap lifecycle events.
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
const LISTENER_OPTIONS: AddEventListenerOptions = { passive: true } as const;

/**
 * Interface representing the return contract for useSystemBootstrap.
 */
export type UseSystemBootstrapReturn = boolean;

/**
 * Subscribes to the window system readiness lifecycle event.
 */
const useSystemReadinessSubscription = (onReady: () => void): void => {
  useEffect(() => {
    window.addEventListener(SYSTEM_READY_EVENT, onReady, LISTENER_OPTIONS);
    
    return () => {
      window.removeEventListener(SYSTEM_READY_EVENT, onReady, LISTENER_OPTIONS);
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

  useSystemReadinessSubscription(() => {
    startTransition(() => {
      setIsSystemReady(true);
    });
  });

  return isSystemReady;
};