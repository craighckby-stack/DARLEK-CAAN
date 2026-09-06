import { useState, useCallback, useMemo } from 'react';

export type QuantumState<T> = T & { readonly timestamp: number };
export type QuantumUpdater<T> = (prev: QuantumState<T>) => T;
export type UseQuantumStateReturn<T> = readonly [QuantumState<T>, (updater: QuantumUpdater<T>) => void];

/**
 * Creates a timestamped state container with minimal allocations.
 */
const createQuantumState = <T extends Record<string, unknown>>(initialValue: T): QuantumState<T> => {
  const newState = Object.assign({}, initialValue) as unknown as QuantumState<T>;
  (newState as { timestamp: number }).timestamp = Date.now();
  return newState;
};

/**
 * Fast-path structural validation avoiding heavy checks.
 */
const validateNextState = <T>(nextState: unknown): asserts nextState is T => {
  if (nextState === null || typeof nextState !== 'object') {
    throw new Error('Quantum updater must return a valid object state.');
  }
};

export const useQuantumState = <T extends Record<string, unknown>>(initial: T): UseQuantumStateReturn<T> => {
  const [state, setState] = useState<QuantumState<T>>(() => createQuantumState(initial));

  const updateState = useCallback((updater: QuantumUpdater<T>) => {
    setState(previousState => {
      try {
        const nextState = updater(previousState);
        validateNextState<T>(nextState);
        return createQuantumState(nextState);
      } catch (error) {
        console.error('[EMG Core v49] QuantumState Mutation Failure:', error);
        return previousState;
      }
    });
  }, []);

  return useMemo(() => [state, updateState], [state, updateState]);
};