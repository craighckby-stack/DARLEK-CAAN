import { useState, useCallback, useRef, useMemo } from 'react';

export type OrchestraStatus = 'IDLE' | `EXECUTING_${string}`;

export interface UseAgentOrchestraReturn {
  readonly status: OrchestraStatus;
  readonly dispatch: (action: string) => void;
}

const isValidAction = (action: unknown): action is string => {
  return typeof action === 'string' && action.trim().length > 0;
};

export const useAgentOrchestra = (): UseAgentOrchestraReturn => {
  const [status, setStatus] = useState<OrchestraStatus>('IDLE');
  
  const statusRef = useRef<OrchestraStatus>(status);
  statusRef.current = status;

  const dispatch = useCallback((action: string): void => {
    if (!isValidAction(action)) {
      console.warn('[useAgentOrchestra] Invalid action dispatched');
      return;
    }

    const nextStatus: OrchestraStatus = `EXECUTING_${action}`;
    
    if (statusRef.current !== nextStatus) {
      setStatus(nextStatus);
    }
  }, []);

  return useMemo(
    () => ({
      status,
      dispatch,
    }),
    [status, dispatch]
  );
};