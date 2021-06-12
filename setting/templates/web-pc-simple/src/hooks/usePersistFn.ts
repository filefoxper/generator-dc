import { useCallback, useRef } from 'react';

/**
 * 指针不变，内容更新的回调函数
 *
 * @param callback
 */
export const usePersistFn = <T extends (...args: any[]) => any>(
  callback: T
): T => {
  const ref = useRef(callback);

  ref.current = callback;

  return useCallback((...args: any[]) => {
    return ref.current(...args);
  }, []) as T;
};
