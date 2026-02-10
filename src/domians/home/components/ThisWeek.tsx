import { Alert } from "@/components/Alert";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { fetchAllOccurrences } from "@/services/firebase/events";
import { Event } from "@/components/Event";
import { skipToken, useQuery } from "@tanstack/react-query";
import { endOfWeek } from "date-fns";
import { ErrorIndicator } from "@/components/ErrorIndicator";
import { useAuth } from "@/contexts/auth";
import { isUserMissingAvailability } from "@/services/firebase/availability";

export function ThisWeek() {
  const { user } = useAuth();

  const {
    data: thisWeekOccurrences,
    isLoading: isLoadingThisWeek,
    isError: isErrorThisWeek,
  } = useQuery({
    queryKey: ["this-week-occurrences"],
    queryFn: () => fetchAllOccurrences(undefined, endOfWeek(new Date())),
  });

  const {
    data: userIsMissingAvailability,
    isLoading: isLoadingAvailability,
    isError: isErrorAvailabilty,
  } = useQuery({
    queryKey: ["has-entered-weekly-availability"],
    queryFn:
      user && thisWeekOccurrences
        ? () => isUserMissingAvailability(user.uid, thisWeekOccurrences)
        : skipToken,
  });

  return (
    <div className="flex flex-col gap-4">
      <h2>Deze week</h2>
      <div className="min-h-9.25">
        {isLoadingAvailability ? undefined : !userIsMissingAvailability ||
          isErrorAvailabilty ? (
          <Alert type="success" size="small">
            Je ben bij voor deze week!
          </Alert>
        ) : (
          <Alert type="danger" size="small">
            Geef je aanwezigheid op!
          </Alert>
        )}
      </div>

      {isLoadingAvailability || isLoadingThisWeek ? (
        <LoadingIndicator />
      ) : isErrorThisWeek || !thisWeekOccurrences ? (
        <ErrorIndicator type="small">
          Het is niet gelukt om de activiteiten van deze week op te halen
        </ErrorIndicator>
      ) : (
        thisWeekOccurrences.map((occ) => (
          <Event key={occ.id} occurrence={occ} />
        ))
      )}
    </div>
  );
}
