import { useCallback } from "react";
import { Status } from "@/types/status";
import { useClickPreventionOnDoubleClick } from "@/hooks/useClickPreventionOnDoubleClick";

export function useAvailabilityPresentButtonHandlers(
  availability: Status | undefined,
  mutate: (status: Status) => void,
) {
  const setPresent = useCallback(() => mutate(Status.Present), [mutate]);

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

  const [deferSingleClick, onDoubleClick] = useClickPreventionOnDoubleClick(
    setPresent,
    togglePresentLater,
    300,
  );

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (availability !== Status.Present && availability !== Status.Later) {
        mutate(Status.Present);
        return;
      }
      deferSingleClick(e);
    },
    [availability, mutate, deferSingleClick],
  );

  return { onClick, onDoubleClick };
}
