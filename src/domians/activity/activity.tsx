import { AvailabilitySelector } from "@/components/AvailabilitySelector";
import { BaseDetailScreen } from "@/components/BaseDetailScreen/BaseDetailScreen";
import { ErrorIndicator } from "@/components/ErrorIndicator";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { useAuth } from "@/contexts/auth";
import { getAllAccountsDisplayNames } from "@/services/firebase/accounts";
import { getOccurrenceAvailability } from "@/services/firebase/availability";
import { getOccurrenceById } from "@/services/firebase/events";
import { Status } from "@/types/status";
import { getEventColor } from "@/utils/getEventColor";
import { useQuery } from "@tanstack/react-query";
import { format, isSameDay } from "date-fns";
import { nl } from "date-fns/locale";
import { useState } from "react";

export function ActivityPage({ id }: { id: string }) {
  const { user } = useAuth();
  const [selected, setSelected] = useState(Status.Present);
  const {
    data: occurrence,
    isLoading: isLoadingOccurrence,
    isError: isErrorOccurrence,
  } = useQuery({
    queryKey: ["occurrence", id, user?.uid],
    queryFn: () => getOccurrenceById(id),
    enabled: !!user,
  });
  const {
    data: availability,
    isLoading: isLoadingAvailability,
    isError: isErrorAvailability,
  } = useQuery({
    queryKey: ["occurrenceAvailability", id, user?.uid],
    queryFn: () => getOccurrenceAvailability(id),
    staleTime: 30 * 60 * 1000,
    refetchOnMount: false,
    enabled: !!user,
  });
  const {
    data: displayNames,
    isLoading: isLoadingAccount,
    isError: isErrorAccounts,
  } = useQuery({
    queryKey: ["userDisplayNames", user?.uid],
    queryFn: () => getAllAccountsDisplayNames(),
    staleTime: 30 * 60 * 1000,
    refetchOnMount: false,
    enabled: !!user,
  });

  return (
    <BaseDetailScreen
      heightClass="h-30"
      title={occurrence?.name ?? "Activiteit details"}
      color={getEventColor(occurrence?.category)}
    >
      <div>
        {isLoadingOccurrence ? (
          <LoadingIndicator />
        ) : isErrorOccurrence || !occurrence ? (
          <ErrorIndicator>
            Het is niet gelukt om de activiteit data op te halen.
          </ErrorIndicator>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="bg-white p-4 rounded-3xl flex flex-col gap-4">
              <div>
                <h2>{occurrence.name}</h2>
                <p className="text-sm text-gray-500">
                  {`${format(occurrence.startTime.toDate(), "d LLLL HH:mm", { locale: nl })} - ${format(occurrence.endTime.toDate(), isSameDay(occurrence.endTime.toDate(), occurrence.startTime.toDate()) ? "HH:mm" : "d LLLL HH:mm", { locale: nl })}`}
                </p>
              </div>
              <AvailabilitySelector occurrenceId={occurrence.id} />
            </div>

            <div className="flex flex-col gap-2">
              <h2>Aanwezigheid</h2>
              <div className="flex flex-col gap-6">
                <div className="flex justify-between">
                  {Object.values(Status).map((statusOption) => (
                    <button
                      key={statusOption}
                      onClick={() => setSelected(statusOption)}
                      className={`px-3 py-1 rounded-lg ${
                        selected === statusOption
                          ? selected === Status.Absent
                            ? "bg-error"
                            : selected === Status.Maybe
                              ? "bg-danger"
                              : "bg-success"
                          : getEventColor(occurrence?.category)
                      }`}
                      disabled={isLoadingAvailability}
                    >
                      <p>{statusOption}</p>
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  {isLoadingAvailability || isLoadingAccount ? (
                    <div className="py-2 px-4 bg-white rounded-lg">
                      <LoadingIndicator />
                    </div>
                  ) : isErrorAvailability || isErrorAccounts ? (
                    <div className="py-2 px-4 bg-white rounded-lg">
                      <ErrorIndicator type="small">
                        Het is mislukt om de aanwezigheid op te halen
                      </ErrorIndicator>
                    </div>
                  ) : !availability ||
                    !availability[selected] ||
                    !displayNames ? (
                    <div className="py-2 px-4 bg-white rounded-lg">
                      <ErrorIndicator type="small">
                        Niemand heeft deze aanwezigheid opgegeven
                      </ErrorIndicator>
                    </div>
                  ) : (
                    availability[selected].map((userId) => (
                      <div
                        key={userId}
                        className="py-2 px-4 bg-white rounded-lg"
                      >
                        <p>{displayNames[userId] ?? "Niet bekend"}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseDetailScreen>
  );
}
