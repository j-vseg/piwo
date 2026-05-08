import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getUserAvailability,
  setUserAvailability,
} from "@/services/firebase/availability";
import { AVAILABILITY_SELECTOR_STATUSES, Status } from "@/types/status";
import { LoadingIndicator } from "./LoadingIndicator";
import { useAuth } from "@/contexts/auth";
import { ErrorIndicator } from "./ErrorIndicator";
import { Category } from "@/types/category";
import { getEventColor } from "@/utils/getEventColor";
import { useAvailabilityPresentButtonHandlers } from "@/hooks/useAvailabilityPresentButtonHandlers";

interface AvailabilitySelectorProps {
  occurrenceId: string;
  occurrenceCategory?: Category;
}

export function AvailabilitySelector({
  occurrenceId,
  occurrenceCategory,
}: AvailabilitySelectorProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: availability } = useQuery({
    queryKey: ["user-availability", occurrenceId, user?.uid],
    queryFn: user
      ? () => getUserAvailability(occurrenceId, user.uid)
      : skipToken,
    staleTime: 30 * 60 * 1000,
  });

  const {
    isPending: updateIsPending,
    isError: updateIsError,
    mutate: updateMutate,
  } = useMutation({
    mutationFn: (status?: Status) =>
      setUserAvailability(occurrenceId, user!.uid, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-availability", occurrenceId, user?.uid],
      });
      queryClient.invalidateQueries({
        queryKey: ["has-entered-weekly-availability", user?.uid],
      });
      queryClient.invalidateQueries({
        queryKey: ["occurrenceAvailability", occurrenceId],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { onClick: presentClick, onDoubleClick: presentDoubleClick } =
    useAvailabilityPresentButtonHandlers(
      availability ?? undefined,
      updateMutate,
    );

  if (!user) {
    return <ErrorIndicator type="small">Je bent niet ingelogd</ErrorIndicator>;
  }

  if (updateIsPending) {
    return <LoadingIndicator />;
  }

  if (updateIsError) {
    return (
      <ErrorIndicator type="small">
        Het updaten van je aanwezigheid is mislukt
      </ErrorIndicator>
    );
  }

  return (
    <div className="flex justify-between">
      {AVAILABILITY_SELECTOR_STATUSES.map((statusOption) => {
        if (statusOption === Status.Present) {
          return (
            <button
              key={statusOption}
              type="button"
              title="Dubbelklik om 'Later' te kiezen"
              onClick={presentClick}
              onDoubleClick={presentDoubleClick}
              className={`px-3 py-1 rounded-lg touch-manipulation select-none ${
                availability === Status.Present || availability === Status.Later
                  ? "bg-success"
                  : getEventColor(occurrenceCategory)
              }`}
              disabled={updateIsPending}
            >
              <p className="text-center leading-tight">
                {availability === Status.Later ? Status.Later : Status.Present}
              </p>
            </button>
          );
        }

        return (
          <button
            key={statusOption}
            type="button"
            onClick={() => updateMutate(statusOption)}
            className={`px-3 py-1 rounded-lg ${
              availability === statusOption
                ? statusOption === Status.Absent
                  ? "bg-error"
                  : "bg-danger"
                : getEventColor(occurrenceCategory)
            }`}
            disabled={updateIsPending}
          >
            <p>{statusOption}</p>
          </button>
        );
      })}
    </div>
  );
}
