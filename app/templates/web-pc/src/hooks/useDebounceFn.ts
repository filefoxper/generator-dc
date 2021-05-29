import { useRef } from 'React';

export type DebounceOptions = {
  wait?: number;
};

/**
 * 用来处理防抖函数的 Hook。
 * @param fn
 * @param ms
 */
const useDebounceFn = <T extends (...args: any[]) => void>(fn: T, ms: number): T => {
  const fnRef = useRef<{ version: any | undefined; fn: T; runner: (...args: any[]) => void }>({
    version: undefined,
    fn,
    runner(...args: any[]) {
      const call = this.fn;
      clearTimeout(this.version);
      this.version = setTimeout(async () => {
        call(...args);
      }, ms);
    },
  });
  fnRef.current!.fn = fn;
  return fnRef.current!.runner.bind(fnRef.current!) as T;
};

export default useDebounceFn;
