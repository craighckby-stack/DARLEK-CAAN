import { useState, useEffect, useCallback, useRef } from 'react';

export interface MutationRecord {
  id?: string;
  timestamp?: number;
  [key: string]: unknown;
}

export interface UseMutationDataResult {
  mutations: MutationRecord[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface BrainApiResponse {
  mutations?: unknown;
  [key: string]: unknown;
}

const API_ENDPOINT = '/api/brain';
const MUTATION_ACTION = 'get-mutation-history';

async function fetchMutationHistory(
  sessionId: string,
  signal: AbortSignal
): Promise<MutationRecord[]> {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: MUTATION_ACTION,
      sessionId,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as BrainApiResponse;

  return Array.isArray(data?.mutations) ? (data.mutations as MutationRecord[]) : [];
}

export function useMutationData(
  sessionId: string | null | undefined,
  trigger?: number
): UseMutationDataResult {
  const [mutations, setMutations] = useState<MutationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [manualTrigger, setManualTrigger] = useState<number>(0);

  const refetch = useCallback(() => {
    setManualTrigger((prev) => prev + 1);
  }, []);

  const sessionIdRef = useRef(sessionId);
  sessionIdRef.current = sessionId;

  useEffect(() => {
    const currentSessionId = sessionIdRef.current;
    
    if (!currentSessionId) {
      setMutations([]);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const loadMutations = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchMutationHistory(currentSessionId, controller.signal);

        if (isMounted) {
          setMutations(result);
        }
      } catch (err: unknown) {
        if (isMounted && err instanceof Error && err.name !== 'AbortError') {
          setError(err);
          setMutations([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadMutations();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [sessionId, trigger, manualTrigger]);

  return { mutations, loading, error, refetch };
}