import { useCallback, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Status } from "@/types/status";

export function useAvailabilityPresentButtonHandlers(
  availability: Status | undefined,
  mutate: (status: Status) => void,
) {
  const debouncedSetPresent = useDebouncedCallback(() => {
    mutate(Status.Present);
  }, 300);

  useEffect(() => {
    return () => {
      debouncedSetPresent.cancel();
    };
  }, [debouncedSetPresent]);

  const togglePresentLater = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (availability !== Status.Present && availability !== Status.Later) {
        return;
      }
      e.preventDefault();
      mutate(
        availability === Status.Later ? Status.Present : Status.Later,
      );
    },
    [availability, mutate],
  );

  const onDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      debouncedSetPresent.cancel();
      togglePresentLater(e);
    },
    [debouncedSetPresent, togglePresentLater],
  );

  const onClick = useCallback(() => {
    if (availability !== Status.Present && availability !== Status.Later) {
      mutate(Status.Present);
      return;
    }
    debouncedSetPresent();
  }, [availability, mutate, debouncedSetPresent]);

  return { onClick, onDoubleClick };
}
