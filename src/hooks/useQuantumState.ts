import { useState, useCallback, useMemo } from 'react';

export type QuantumState<T> = T & { readonly timestamp: number };
export type QuantumUpdater<T> = (prev: QuantumState<T>) => T;
export type UseQuantumStateReturn<T> = readonly [QuantumState<T>, (updater: QuantumUpdater<T>) => void];

/**
 * Creates an immutable timestamped state container from the given payload.
 */
const createQuantumState = <T extends Record<string, unknown>>(initialValue: T): QuantumState<T> => {
  const timestampedState = {
    ...initialValue,
    timestamp: Date.now(),
  };

  return timestampedState as unknown as QuantumState<T>;
};

/**
 * Validates that the upcoming state satisfies object-shape requirements.
 */
const validateNextState = <T>(nextState: unknown): asserts nextState is T => {
  if (nextState === null || typeof nextState !== 'object') {
    throw new Error('Quantum updater must return a valid object state.');
  }
};

/**
 * React hook for managing timestamped state transitions with structural validation and error safety.
 */
export const useQuantumState = <T extends Record<string, unknown>>(initial: T): UseQuantumStateReturn<T> => {
  const [state, setState] = useState<QuantumState<T>>(() => createQuantumState(initial));

  const updateState = useCallback((updater: QuantumUpdater<T>) => {
    setState((previousState) => {
      try {
        const nextState = updater(previousState);
        validateNextState<T>(nextState);
        return createQuantumState(nextState);
      } catch (error) {
        console.error('[Darlek Caan] QuantumState Mutation Failure:', error);
        return previousState;
      }
    });
  }, []);

  return useMemo(() => [state, updateState] as const, [state, updateState]);
};