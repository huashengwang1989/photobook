import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { genUid } from '../dim/uid';

import type { LocalStatus } from './types';

function useFetch<T>({
  func,
  defaultValue,
  options,
}: {
  /**
   * The callback.
   *
   * - It is a function with no parameters.
   * - It must be memomised in React.
   */
  func: undefined | null | (() => T | Promise<T>) /**
   * You must specify a default value, even when it can be initialised as
   * `undefined`
   */,
  defaultValue: T,
  options?: {
    /**
     * If a number is assigned, after this milliseconds, status will be resetted
     * to "" if it is "success" or "error"
     */
    resetStatusAfterMs?: number,
  },
}) {
  const { resetStatusAfterMs } = options || {};
  const [localStatus, setLocalStatus] = useState<LocalStatus>('');

  const [data, setData] = useState<T>(defaultValue);
  const [dataError, setdataError] = useState<unknown>(undefined);

  const curDealingRef = useRef('');

  const handleResetStatus = useCallback(
    (uid: string) => {
      if (resetStatusAfterMs) {
        setTimeout(() => {
          if (uid === curDealingRef.current) {
            setLocalStatus('');
          }
        }, resetStatusAfterMs);
      }
    },
    [resetStatusAfterMs],
  );

  const updateValue = useCallback(
    (value: T | Promise<T>) => {
      const uid = genUid();
      curDealingRef.current = uid;
      if (value instanceof Promise) {
        value
          .then((data) => {
            setData(data);
            setLocalStatus('success');
          })
          .catch((err) => {
            setdataError(err);
            setLocalStatus('error');
          })
          .finally(() => {
            handleResetStatus(uid);
          });
      } else {
        setData(value);
        setLocalStatus('success');
        handleResetStatus(uid);
      }
    },
    [handleResetStatus],
  );

  const handleFetch = useCallback(() => {
    if (!func) {
      return;
    }
    const result = func();
    updateValue(result);
  }, [func, updateValue]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  const output = useMemo(
    () => ({
      status: localStatus,
      data,
      error: dataError,
      updateValue,
      refresh: handleFetch,
    }),
    [data, dataError, handleFetch, localStatus, updateValue],
  );

  return output;
}

export { useFetch };
