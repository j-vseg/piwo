import { useCallback, useEffect, useRef } from "react";

/**
 * Delay single-click until idle, then run it; cancel the pending run on
 * double-click. Same idea as trailing debounce + clear on dblclick (see
 * https://stackoverflow.com/questions/1546040/how-to-use-both-onclick-and-ondblclick-on-an-element)
 * with a single timer like
 * https://stackoverflow.com/questions/75988682/debounce-in-javascript
 */
export function useClickPreventionOnDoubleClick<
  T extends HTMLElement = HTMLElement,
>(
  onClick: (event: React.MouseEvent<T>) => void,
  onDoubleClick: (event: React.MouseEvent<T>) => void,
  delayMs = 300,
): readonly [
  (event: React.MouseEvent<T>) => void,
  (event: React.MouseEvent<T>) => void,
] {
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingClick = useCallback(() => {
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  }, []);

  const handleClick = useCallback(
    (event: React.MouseEvent<T>) => {
      clearPendingClick();
      timeoutIdRef.current = setTimeout(() => {
        timeoutIdRef.current = null;
        onClick(event);
      }, delayMs);
    },
    [onClick, delayMs, clearPendingClick],
  );

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent<T>) => {
      clearPendingClick();
      onDoubleClick(event);
    },
    [clearPendingClick, onDoubleClick],
  );

  useEffect(() => {
    return () => {
      clearPendingClick();
    };
  }, [clearPendingClick]);

  return [handleClick, handleDoubleClick] as const;
}
