import { Alert } from "@/components/Alert";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { fetchAllOccurrences } from "@/services/firebase/events";
import { Event } from "@/components/Event";
import { skipToken, useQuery } from "@tanstack/react-query";
import { endOfWeek, startOfToday } from "date-fns";
import { ErrorIndicator } from "@/components/ErrorIndicator";
import { useAuthenticatedUser } from "@/contexts/auth";
import { isUserMissingAvailability } from "@/services/firebase/availability";
import { useMemo } from "react";

export function ThisWeek() {
  const user = useAuthenticatedUser();
  const endOfTheWeek = useMemo(() => {
    return endOfWeek(startOfToday(), { weekStartsOn: 1 });
  }, []);
  const {
    data: thisWeekOccurrences,
    isLoading: isLoadingThisWeek,
    isError: isErrorThisWeek,
  } = useQuery({
    queryKey: ["this-week-occurrences", endOfTheWeek],
    queryFn: () => fetchAllOccurrences(undefined, endOfTheWeek),
    staleTime: 30 * 60 * 1000,
    refetchOnMount: false,
  });

  const {
    data: userIsMissingAvailability,
    isLoading: isLoadingAvailability,
    isError: isErrorAvailabilty,
  } = useQuery({
    queryKey: [
      "has-entered-weekly-availability",
      user.uid,
      thisWeekOccurrences,
    ],
    queryFn:
      thisWeekOccurrences
        ? () => isUserMissingAvailability(user.uid, thisWeekOccurrences)
        : skipToken,
    staleTime: 30 * 60 * 1000,
    refetchOnMount: false,
  });

  return (
    <div className="flex flex-col gap-4">
      <h2>Deze week</h2>
      <div className="min-h-9.25">
        {isLoadingAvailability ? undefined : !userIsMissingAvailability ||
          isErrorAvailabilty ? (
          <Alert type="success" size="small">
            Je bent bij voor deze week!
          </Alert>
        ) : (
          <Alert type="danger" size="small">
            Geef je aanwezigheid op!
          </Alert>
        )}
      </div>

      {!thisWeekOccurrences && (isLoadingThisWeek || isLoadingAvailability) ? (
        <LoadingIndicator />
      ) : isErrorThisWeek ? (
        <ErrorIndicator type="small">
          Het is niet gelukt om de activiteiten van deze week op te halen
        </ErrorIndicator>
      ) : !thisWeekOccurrences ? (
        <p className="py-4 text-center">
          Geen geplande activiteiten meer voor deze week
        </p>
      ) : (
        thisWeekOccurrences.map((occ) => (
          <Event key={occ.id} occurrence={occ} />
        ))
      )}
    </div>
  );
}
