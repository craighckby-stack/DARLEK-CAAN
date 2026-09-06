import { useState, useEffect, useCallback, useRef } from 'react';

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error' | (string & {});

export interface SystemState {
  setupComplete: boolean;
  connectionStatus: ConnectionStatus;
  [key: string]: unknown;
}

type StateUpdater = SystemState | ((prevState: SystemState) => SystemState);

const STORAGE_KEY = 'darlek_cann_state';

const INITIAL_STATE: SystemState = {
  setupComplete: false,
  connectionStatus: 'idle',
};

/**
 * Safely parses JSON from storage, logging any errors encountered.
 */
const readStoredState = (): Partial<SystemState> | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return null;
    
    const parsed = JSON.parse(saved) as unknown;
    return (parsed !== null && typeof parsed === 'object') ? (parsed as Partial<SystemState>) : null;
  } catch (error) {
    console.error(`Failed to parse state from key "${STORAGE_KEY}":`, error);
    return null;
  }
};

/**
 * Safely persists state to storage, logging any errors encountered.
 */
const writeStoredState = (state: SystemState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error(`Failed to persist state to key "${STORAGE_KEY}":`, error);
  }
};

export const useSystemState = () => {
  const [systemState, setSystemState] = useState<SystemState>(INITIAL_STATE);
  
  // Maintain a stable reference to the current state to prevent stale closures
  const stateRef = useRef(systemState);
  stateRef.current = systemState;

  useEffect(() => {
    let isMounted = true;
    const storedData = readStoredState();

    if (storedData) {
      // Defer state hydration to avoid cascading render warnings on mount
      const timer = setTimeout(() => {
        if (isMounted) {
          setSystemState((prevState) => ({ ...prevState, ...storedData }));
        }
      }, 0);

      return () => {
        isMounted = false;
        clearTimeout(timer);
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

  return { systemState, updateState, persist };
};