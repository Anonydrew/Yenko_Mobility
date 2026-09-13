import { useCallback, useEffect, useState, type DependencyList } from 'react';
import { ApiError, isAbortError } from './api';

type AsyncState<T> =
  | { status: 'loading'; data: T | undefined; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: T | undefined; error: ApiError };

/** Runs an async loader whenever `deps` change, cancelling the previous run. */
export function useAsync<T>(load: (signal: AbortSignal) => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading', data: undefined, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((previous) => ({ status: 'loading', data: previous.data, error: null }));

    load(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ status: 'success', data, error: null });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isAbortError(error)) return;
        const apiError = error instanceof ApiError ? error : new ApiError(0, 'Something went wrong. Please try again.');
        setState((previous) => ({ status: 'error', data: previous.data, error: apiError }));
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const reload = useCallback(() => setAttempt((value) => value + 1), []);

  return { ...state, reload };
}
