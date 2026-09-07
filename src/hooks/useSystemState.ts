import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error' | (string & {});

export interface SystemState {
  setupComplete: boolean;
  connectionStatus: ConnectionStatus;
  [key: string]: unknown;
}

export type StateUpdater = SystemState | ((prevState: SystemState) => SystemState);

const STORAGE_KEY = 'darlek_cann_state';

const INITIAL_STATE: SystemState = {
  setupComplete: false,
  connectionStatus: 'idle',
};

/**
 * Safely parses JSON from storage with defensive type validation.
 */
const readStoredState = (): Partial<SystemState> | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return null;
    
    const parsed = JSON.parse(saved) as unknown;
    return (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) 
      ? (parsed as Partial<SystemState>) 
      : null;
  } catch (error) {
    console.error(`[EMG Engine] Failed to parse state from key "${STORAGE_KEY}":`, error);
    return null;
  }
};

/**
 * Safely persists state to storage with exception trapping.
 */
const writeStoredState = (state: SystemState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error(`[EMG Engine] Failed to persist state to key "${STORAGE_KEY}":`, error);
  }
};

export const useSystemState = () => {
  const [systemState, setSystemState] = useState<SystemState>(INITIAL_STATE);
  
  // Maintain a synchronized reference to avoid stale closures and unnecessary re-renders
  const stateRef = useRef(systemState);
  stateRef.current = systemState;

  useEffect(() => {
    let isMounted = true;
    const storedData = readStoredState();

    if (storedData) {
      const timer = requestAnimationFrame(() => {
        if (isMounted) {
          setSystemState((prevState) => ({ ...prevState, ...storedData }));
        }
      });

      return () => {
        isMounted = false;
        cancelAnimationFrame(timer);
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const persist = useCallback((newState: StateUpdater) => {
    setSystemState((prevState) => {
      const resolvedState = typeof newState === 'function' ? newState(prevState) : newState;
      writeStoredState(resolvedState);
      return resolvedState;
    });
  }, []);

  const updateState = useCallback((newState: StateUpdater) => {
    setSystemState(newState);
  }, []);

  return useMemo(() => ({
    systemState,
    updateState,
    persist,
  }), [systemState, updateState, persist]);
};